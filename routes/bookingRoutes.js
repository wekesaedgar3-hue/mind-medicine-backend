const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

// ✅ Admin: Get all bookings
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ["id", "fullName", "email"] },
        { model: Package, attributes: ["id", "title", "price"] },
      ],
      order: [["createdAt", "DESC"]],
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
      include: [{ model: Package, attributes: ["id", "title", "price"] }],
      order: [["createdAt", "DESC"]],
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
    const { packageId, date } = req.body;

    if (!packageId || !date) {
      return res.status(400).json({ message: "Package and date are required" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      packageId,
      date,
      status: "Pending",
    });

    res.json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error creating booking" });
  }
});

module.exports = router;

