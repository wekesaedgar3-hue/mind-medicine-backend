// routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const uploadBookings = require("../middleware/uploadBookings");

const router = express.Router();

// ✅ Create booking (with optional receipt upload)
router.post(
  "/",
  uploadBookings.single("receipt"),
  bookingController.createBooking
);

// ✅ Get all bookings
router.get("/", bookingController.getBookings);

// ✅ Get booking by ID
router.get("/:id", bookingController.getBookingById);

// ✅ Delete booking
router.delete("/:id", bookingController.deleteBooking);

// ✅ Upload only booking receipt
router.post(
  "/upload-receipt",
  uploadBookings.single("receipt"),
  bookingController.uploadReceipt
);

module.exports = router;








