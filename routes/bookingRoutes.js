// routes/bookingRoutes.js
const express = require("express");
const bookingController = require("../controllers/bookingController");
const uploadBookings = require("../middleware/uploadBookings");

const router = express.Router();

// ✅ Create booking (with optional receipt upload)
if (bookingController.createBooking) {
  router.post(
    "/",
    uploadBookings.single("receipt"),
    bookingController.createBooking
  );
}

// ✅ Get all bookings
if (bookingController.getBookings) {
  router.get("/", bookingController.getBookings);
}

// ✅ Get booking by ID
if (bookingController.getBookingById) {
  router.get("/:id", bookingController.getBookingById);
}

// ✅ Delete booking
if (bookingController.deleteBooking) {
  router.delete("/:id", bookingController.deleteBooking);
}

// ✅ Upload only booking receipt
if (bookingController.uploadReceipt) {
  router.post(
    "/upload-receipt",
    uploadBookings.single("receipt"),
    bookingController.uploadReceipt
  );
}

module.exports = router;






