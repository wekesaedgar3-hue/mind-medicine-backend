const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/activities/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all activities (public)
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (err) {
    console.error("Error loading activities:", err);
    res.status(500).json({ message: "Server error loading activities" });
  }
});

// ✅ Upload new activity (admin only)
router.post("/", authenticate, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const image = req.file ? `/uploads/activities/${req.file.filename}` : null;

    const newActivity = await Activity.create({ name, description, location, image });
    res.json(newActivity);
  } catch (err) {
    console.error("Error uploading activity:", err);
    res.status(500).json({ message: "Server error uploading activity" });
  }
});

module.exports = router;

