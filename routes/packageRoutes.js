const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const Package = require("../models/Package");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/packages/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Get all packages (public)
router.get("/", async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (err) {
    console.error("Error loading packages:", err);
    res.status(500).json({ message: "Server error loading packages" });
  }
});

// ✅ Upload new package (admin only)
router.post("/", authenticate, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/packages/${req.file.filename}` : null;

    const newPackage = await Package.create({ title, description, price, category, image });
    res.json(newPackage);
  } catch (err) {
    console.error("Error uploading package:", err);
    res.status(500).json({ message: "Server error uploading package" });
  }
});

module.exports = router;
