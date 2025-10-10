const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

// ✅ Create booking
exports.createBooking = async (req, res) => {
  try {
    const { packageId, date } = req.body;
    if (!packageId || !date) {
      return res.status(400).json({ message: "Package and date are required" });
    }

    const booking = await Booking.create({
      userId: req.user.id, // ✅ Always the logged-in user
      packageId,
      date,
      status: "Pending",
    });

    res.status(201).json({
      message: "Booking created",
      booking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin: Get all bookings
exports.getBookings = async (req, res) => {
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
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ User: Get their own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Package, attributes: ["id", "title", "price"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "fullName", "email"] },
        { model: Package, attributes: ["id", "title", "price"] },
      ],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload receipt (optional)
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const booking = await Booking.findByPk(req.body.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.receipt = `/uploads/bookings/${req.file.filename}`;
    await booking.save();

    res.json({
      message: "Receipt uploaded",
      receipt: `${getBaseUrl(req)}${booking.receipt}`,
    });
  } catch (err) {
    console.error("Error uploading receipt:", err);
    res.status(500).json({ error: err.message });
  }
};


