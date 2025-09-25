const Activity = require("../models/Activity");

exports.createActivity = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    const image = req.file ? `/uploads/activities/${req.file.filename}` : null;

    const activity = await Activity.create({
      name,
      description,
      location,
      image,
    });

    res.status(201).json({ message: "Activity created", activity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
