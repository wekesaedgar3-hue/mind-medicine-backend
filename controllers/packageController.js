// controllers/packageController.js
const Package = require("../models/Package");

// ✅ Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: error.message || "Failed to fetch packages" });
  }
};

// ✅ Create a new package (admin only)
exports.createPackage = async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed or missing" });
    }

    const image = `/uploads/packages/${req.file.filename}`;

    const newPackage = await Package.create({ title, price, image });

    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: error.message || "Failed to create package" });
  }
};

// ✅ Update a package (admin only)
exports.updatePackage = async (req, res) => {
  try {
    const { title, price } = req.body;
    const packageToUpdate = await Package.findByPk(req.params.id);

    if (!packageToUpdate) {
      return res.status(404).json({ message: "Package not found" });
    }

    const image = req.file ? `/uploads/packages/${req.file.filename}` : packageToUpdate.image;

    await packageToUpdate.update({ title, price, image });
    res.json(packageToUpdate);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: error.message || "Failed to update package" });
  }
};

// ✅ Delete a package (admin only)
exports.deletePackage = async (req, res) => {
  try {
    const packageToDelete = await Package.findByPk(req.params.id);

    if (!packageToDelete) {
      return res.status(404).json({ message: "Package not found" });
    }

    await packageToDelete.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: error.message || "Failed to delete package" });
  }
};


