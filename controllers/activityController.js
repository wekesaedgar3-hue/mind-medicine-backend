const fs = require("fs");
const path = require("path");
const Activity = require("../models/Activity");

// ✅ Smart base URL resolver (works for both localhost & Render)
const getBaseUrl = (req) => {
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  return `${req.protocol}://${req.get("host")}`;
};

// ✅ Helper to move uploaded file to /public/images/activities
const moveToPublic = (file, folder) => {
  if (!file) return null;
  const publicDir = path.join(__dirname, "..", "public", "images", folder);
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const newPath = path.join(publicDir, file.filename);
  fs.renameSync(file.path, newPath);

  return `/images/${folder}/${file.filename}`;
};

// ✅ Fetch all activities (public)
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    const baseUrl = getBaseUrl(req);

    const formatted = activities.map((a) => ({
      ...a.toJSON(),
      image: a.image
        ? `${baseUrl}${a.image.startsWith("/") ? a.image : "/" + a.image}`
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: err.message || "Failed to fetch activities" });
  }
};

// ✅ Create new activity (admin)
exports.createActivity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const image = req.file ? moveToPublic(req.file, "activities") : null;

    const newActivity = await Activity.create({ name, description, image });
    const baseUrl = getBaseUrl(req);

    res.status(201).json({
      ...newActivity.toJSON(),
      image: image ? `${baseUrl}${image}` : null,
    });
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(500).json({ message: err.message || "Server error creating activity" });
  }
};

// ✅ Update activity (admin)
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const { name, description } = req.body;
    const image = req.file
      ? moveToPublic(req.file, "activities")
      : activity.image;

    await activity.update({ name, description, image });

    const baseUrl = getBaseUrl(req);
    res.json({
      ...activity.toJSON(),
      image: image ? `${baseUrl}${image}` : null,
    });
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).json({ message: err.message || "Failed to update activity" });
  }
};

// ✅ Delete activity (admin)
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    await activity.destroy();
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("Error deleting activity:", err);
    res.status(500).json({ message: err.message || "Failed to delete activity" });
  }
};
