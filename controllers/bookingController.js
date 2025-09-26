// controllers/bookingController.js
const Booking = require("../models/Booking");

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

// ✅ Create booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, packageId, startDate, endDate, activities, status } = req.body;

    const receipt = req.file ? `/uploads/bookings/${req.file.filename}` : null;

    const booking = await Booking.create({
      userId,
      packageId,
      startDate,
      endDate,
      activities: activities ? JSON.stringify(activities) : null, // store as JSON string
      status,
      receipt,
    });

    res.status(201).json({
      message: "Booking created",
      booking: {
        ...booking.toJSON(),
        activities: booking.activities ? JSON.parse(booking.activities) : null,
        receipt: receipt ? `${getBaseUrl(req)}${receipt}` : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();

    const baseUrl = getBaseUrl(req);
    const formattedBookings = bookings.map((b) => ({
      ...b.toJSON(),
      activities: b.activities ? JSON.parse(b.activities) : null,
      receipt: b.receipt ? `${baseUrl}${b.receipt}` : null,
    }));

    res.json(formattedBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const baseUrl = getBaseUrl(req);
    res.json({
      ...booking.toJSON(),
      activities: booking.activities ? JSON.parse(booking.activities) : null,
      receipt: booking.receipt ? `${baseUrl}${booking.receipt}` : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload receipt only
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const bookingId = req.body.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.receipt = `/uploads/bookings/${req.file.filename}`;
    await booking.save();

    res.json({
      message: "Receipt uploaded",
      receipt: `${getBaseUrl(req)}${booking.receipt}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





