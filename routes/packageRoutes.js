const express = require("express");
const Package = require("../models/Package");
const upload = require("../middleware/upload");

const router = express.Router();

// ✅ Get all packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add package (with optional image upload)
router.post("/", upload.single("packageImage"), async (req, res) => {
  try {
    const { title, price } = req.body;
    const image = req.file ? `/uploads/packages/${req.file.filename}` : null;

    const newPackage = await Package.create({ title, price, image });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update package
router.put("/:id", upload.single("packageImage"), async (req, res) => {
  try {
    const { title, price } = req.body;
    const packageToUpdate = await Package.findByPk(req.params.id);

    if (!packageToUpdate) return res.status(404).json({ message: "Package not found" });

    const image = req.file ? `/uploads/packages/${req.file.filename}` : packageToUpdate.image;

    await packageToUpdate.update({ title, price, image });
    res.json(packageToUpdate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete package
router.delete("/:id", async (req, res) => {
  try {
    const packageToDelete = await Package.findByPk(req.params.id);
    if (!packageToDelete) return res.status(404).json({ message: "Package not found" });

    await packageToDelete.destroy();
    res.json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Upload only package image
router.post("/upload-package", upload.single("packageImage"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "Package image uploaded successfully!",
    filePath: `/uploads/packages/${req.file.filename}`,
  });
});

module.exports = router;




