const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Example admin dashboard (requires admin)
router.get("/dashboard", adminMiddleware, (req, res) => {
  res.json({
    message: `Welcome Admin ${req.user.id} (${req.user.role})!`,
  });
});

module.exports = router;

