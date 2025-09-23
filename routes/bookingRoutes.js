const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");
const upload = require("../middleware/uploadPackages");

const router = express.Router();

// ✅ Create booking (with optional receipt upload)
router.post("/", upload.single("receiptImage"), async (req, res) => {
  try {
    const { userId, packageId, startDate, endDate, activities } = req.body;
    const receipt = req.file ? `/uploads/bookings/${req.file.filename}` : null;

    const booking = await Booking.create({
      userId,
      packageId,
      startDate,
      endDate,
      activities: JSON.stringify(activities),
      receipt,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Package],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [User, Package],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Upload only booking receipt
router.post("/upload-receipt", upload.single("receiptImage"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "Receipt uploaded successfully!",
    filePath: `/uploads/bookings/${req.file.filename}`,
  });
});

module.exports = router;



