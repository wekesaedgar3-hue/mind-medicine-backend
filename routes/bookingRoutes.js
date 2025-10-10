const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

// ✅ Get all bookings (admin only)
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: User, attributes: ["fullName", "email"] }, { model: Package, attributes: ["title"] }]
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error loading bookings:", err);
    res.status(500).json({ message: "Server error loading bookings" });
  }
});

// ✅ Get user’s own bookings
router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Package, attributes: ["title"] }]
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error loading user bookings:", err);
    res.status(500).json({ message: "Server error loading your bookings" });
  }
});

// ✅ Create a new booking
router.post("/", authenticate, async (req, res) => {
  try {
    const { packageId, date } = req.body;
    const booking = await Booking.create({
      userId: req.user.id,
      packageId,
      date,
      status: "Pending"
    });
    res.json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error creating booking" });
  }
});

module.exports = router;


