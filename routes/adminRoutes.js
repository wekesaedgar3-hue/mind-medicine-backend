// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Admin Dashboard Example
router.get("/dashboard", adminMiddleware, (req, res) => {
  res.json({
    message: `Welcome Admin ${req.user.id} (${req.user.role})!`,
  });
});

module.exports = router;


