const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Only admins can view or delete bookings
router.get("/", authenticate, isAdmin, bookingController.getBookings);
router.get("/:id", authenticate, isAdmin, bookingController.getBookingById);

// Users can create bookings
router.post("/", authenticate, bookingController.createBooking);

// Admin only delete
router.delete("/:id", authenticate, isAdmin, bookingController.deleteBooking);

module.exports = router;



