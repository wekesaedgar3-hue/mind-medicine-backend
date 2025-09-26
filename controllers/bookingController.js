const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

// ✅ Create booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, packageId, activities, status } = req.body;

    const receipt = req.file ? `/uploads/bookings/${req.file.filename}` : null;

    const booking = await Booking.create({
      userId,
      packageId,
      activities: activities ? JSON.stringify(activities) : null,
      status,
      receipt,
    });

    res.status(201).json({
      message: "Booking created",
      booking: {
        ...booking.toJSON(),
        receipt: receipt ? `${getBaseUrl(req)}${receipt}` : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all bookings (with User + Package info)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Package, attributes: ["id", "title", "price"] },
      ],
    });

    const baseUrl = getBaseUrl(req);

    const formatted = bookings.map((b) => {
      let activities = [];
      if (b.activities) {
        try {
          activities = JSON.parse(b.activities);
        } catch (err) {
          activities = [];
        }
      }
      return {
        id: b.id,
        user: b.User ? { id: b.User.id, name: b.User.name, email: b.User.email } : null,
        package: b.Package ? { id: b.Package.id, title: b.Package.title, price: b.Package.price } : null,
        activities,
        status: b.status,
        receipt: b.receipt ? `${baseUrl}${b.receipt}` : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Package, attributes: ["id", "title", "price"] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const baseUrl = getBaseUrl(req);
    let activities = [];
    if (booking.activities) {
      try {
        activities = JSON.parse(booking.activities);
      } catch (err) {
        activities = [];
      }
    }

    res.json({
      id: booking.id,
      user: booking.User ? { id: booking.User.id, name: booking.User.name, email: booking.User.email } : null,
      package: booking.Package ? { id: booking.Package.id, title: booking.Package.title, price: booking.Package.price } : null,
      activities,
      status: booking.status,
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

