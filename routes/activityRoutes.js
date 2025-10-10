// routes/activityRoutes.js
const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const upload = require("../middleware/uploadPackages"); // For activity images
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// ✅ Public: Get all activities
router.get("/", activityController.getActivities);

// ✅ Admin: Create activity (with optional image)
router.post(
  "/",
  authenticate,
  isAdmin,
  upload.single("activityImage"),
  activityController.createActivity
);

// ✅ Admin: Delete activity
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const activity = await require("../models/Activity").findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    await activity.destroy();
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Admin: Upload activity image only
router.post(
  "/upload-activity",
  authenticate,
  isAdmin,
  upload.single("activityImage"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    res.json({
      message: "Activity image uploaded successfully!",
      filePath: `/uploads/activities/${req.file.filename}`,
    });
  }
);

module.exports = router;

