// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// ✅ Admin: View all bookings
router.get("/", authenticate, isAdmin, bookingController.getBookings);

// ✅ Admin: Get booking by ID
router.get("/:id", authenticate, isAdmin, bookingController.getBookingById);

// ✅ Users: Create booking
router.post("/", authenticate, bookingController.createBooking);

// ✅ Admin: Delete booking
router.delete("/:id", authenticate, isAdmin, bookingController.deleteBooking);

module.exports = router;


