const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");
const Activity = require("../models/Activity");

async function processMobileMoneyPayment({
  paymentMethod,
  amount,
  phoneNumber,
  accountNumber,
  paymentPin,
}) {
  const providerUrl = process.env.MOBILE_MONEY_API_URL;
  const apiKey = process.env.MOBILE_MONEY_API_KEY;

  if (providerUrl && apiKey) {
    const payload = {
      paymentMethod,
      amount,
      phoneNumber,
      accountNumber,
      pin: paymentPin,
      callbackUrl: process.env.MOBILE_MONEY_CALLBACK_URL || "",
    };

    const response = await fetch(providerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Mobile money payment failed");
    }

    return {
      success: true,
      transactionReference: data.transactionReference || `MM-${Date.now()}`,
    };
  }

  // Fallback simulator when external mobile money API is not configured
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    success: true,
    transactionReference: `${paymentMethod.toUpperCase()}-${Date.now()}`,
  };
}

// ✅ Admin: Get all bookings
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ["id", "fullName", "email"] },
        { model: Package, attributes: ["id", "title", "price"] },
        { model: Activity, attributes: ["id", "name"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error loading bookings:", err);
    res.status(500).json({ message: "Server error loading bookings" });
  }
});

// ✅ User: Get their own bookings
router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Package, attributes: ["id", "title", "price"] },
        { model: Activity, attributes: ["id", "name"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error loading user bookings:", err);
    res.status(500).json({ message: "Server error loading your bookings" });
  }
});

// ✅ Create a new booking (user only)
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      packageId,
      activityId,
      date,
      paymentMethod,
      paymentPin,
      phoneNumber,
      accountNumber,
    } = req.body;

    if (!date || !paymentMethod || !paymentPin) {
      return res.status(400).json({
        message: "Date, payment method and PIN are required for booking",
      });
    }

    const normalizedPaymentMethod = (paymentMethod || "").toLowerCase();
    if (!["mpesa", "account"].includes(normalizedPaymentMethod)) {
      return res.status(400).json({
        message: "Payment method must be mpesa or account",
      });
    }

    if (!/^[0-9]{4,6}$/.test(paymentPin)) {
      return res.status(400).json({
        message: "Payment PIN must be 4 to 6 digits",
      });
    }

    let bookingType = "package";
    let amount = null;
    let itemId = null;
    let paymentPhoneNumber = null;
    let paymentAccountNumber = null;

    if (normalizedPaymentMethod === "mpesa") {
      if (!phoneNumber) {
        return res.status(400).json({
          message: "Phone number is required for M-PESA payments",
        });
      }
      if (!/^\+?[0-9]{9,15}$/.test(phoneNumber)) {
        return res.status(400).json({
          message:
            "Phone number must be 9 to 15 digits, optionally starting with +",
        });
      }
      paymentPhoneNumber = phoneNumber;
    } else {
      if (!accountNumber) {
        return res.status(400).json({
          message: "Account number is required for account payments",
        });
      }
      if (!/^[0-9]{6,20}$/.test(accountNumber)) {
        return res.status(400).json({
          message: "Account number must be 6 to 20 digits",
        });
      }
      paymentAccountNumber = accountNumber;
    }

    if (packageId) {
      const selected = await Package.findByPk(packageId);
      if (!selected)
        return res.status(404).json({ message: "Package not found" });
      amount = selected.price;
      itemId = packageId;
      bookingType = "package";
    } else if (activityId) {
      const selected = await Activity.findByPk(activityId);
      if (!selected)
        return res.status(404).json({ message: "Activity not found" });
      amount = null;
      itemId = activityId;
      bookingType = "activity";
    } else {
      return res.status(400).json({
        message: "Either packageId or activityId is required",
      });
    }

    const paymentResult = await processMobileMoneyPayment({
      paymentMethod: normalizedPaymentMethod,
      amount: amount || 0,
      phoneNumber: paymentPhoneNumber,
      accountNumber: paymentAccountNumber,
      paymentPin,
    });

    const booking = await Booking.create({
      userId: req.user.id,
      packageId: bookingType === "package" ? itemId : null,
      activityId: bookingType === "activity" ? itemId : null,
      startDate: date,
      bookingType,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: paymentResult.success ? "paid" : "failed",
      amount: amount || 0,
      paymentPhoneNumber,
      paymentAccountNumber,
      transactionReference: paymentResult.transactionReference,
      status: paymentResult.success ? "confirmed" : "failed",
    });

    res.json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res
      .status(500)
      .json({ message: err.message || "Server error creating booking" });
  }
});

// ✅ Optional mobile money callback route for asynchronous provider notifications
router.post("/mobile-money-callback", async (req, res) => {
  try {
    const callbackSecret =
      req.headers["x-callback-secret"] || req.body.callbackSecret;
    if (
      !process.env.MOBILE_MONEY_CALLBACK_SECRET ||
      callbackSecret !== process.env.MOBILE_MONEY_CALLBACK_SECRET
    ) {
      return res.status(403).json({ message: "Forbidden callback request" });
    }

    const {
      bookingId,
      transactionReference,
      status,
      paymentMethod,
      phoneNumber,
      accountNumber,
      amount,
    } = req.body;

    const booking = bookingId
      ? await Booking.findByPk(bookingId)
      : await Booking.findOne({ where: { transactionReference } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = status === "paid" ? "paid" : "failed";
    booking.status = status === "paid" ? "confirmed" : "failed";
    booking.transactionReference =
      transactionReference || booking.transactionReference;
    if (phoneNumber) booking.paymentPhoneNumber = phoneNumber;
    if (accountNumber) booking.paymentAccountNumber = accountNumber;
    if (amount != null) booking.amount = amount;

    await booking.save();

    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("Error handling mobile money callback:", err);
    res.status(500).json({ message: "Callback handling failed" });
  }
});

router.get("/provider-info", authenticate, async (req, res) => {
  try {
    const providerUrl = process.env.MOBILE_MONEY_API_URL;
    const apiKey = process.env.MOBILE_MONEY_API_KEY;

    res.json({
      enabled: !!providerUrl && !!apiKey,
      providerLabel:
        process.env.MOBILE_MONEY_PROVIDER_NAME || "Mobile Money Provider",
      callbackUrl: process.env.MOBILE_MONEY_CALLBACK_URL || null,
      methods: ["mpesa", "account"],
    });
  } catch (err) {
    console.error("Error loading payment provider info:", err);
    res.status(500).json({ message: "Server error loading provider info" });
  }
});

module.exports = router;
