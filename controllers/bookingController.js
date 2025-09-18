const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { userId, packageId, activityId, status } = req.body;

    const receipt = req.file ? `/uploads/bookings/${req.file.filename}` : null;

    const booking = await Booking.create({
      userId,
      packageId,
      activityId,
      status,
      receipt,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
