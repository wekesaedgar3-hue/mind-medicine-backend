const express = require("express");
const Activity = require("../models/Activity");
const upload = require("../middleware/upload"); // ✅ Multer middleware

const router = express.Router();

// ✅ Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add activity (with optional image upload)
router.post("/", upload.single("activityImage"), async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.file ? `/uploads/activities/${req.file.filename}` : null;

    const newActivity = await Activity.create({ description, image });
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete activity
router.delete("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    await activity.destroy();
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Upload only activity image
router.post("/upload-activity", upload.single("activityImage"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "Activity image uploaded successfully!",
    filePath: `/uploads/activities/${req.file.filename}`,
  });
});

module.exports = router;
