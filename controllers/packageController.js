const Package = require("../models/Package");

const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

// Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    const baseUrl = getBaseUrl(req);
    const formatted = packages.map((p) => ({ ...p.toJSON(), image: p.image ? `${baseUrl}${p.image}` : null }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching packages:", err);
    res.status(500).json({ message: err.message || "Failed to fetch packages" });
  }
};

// Get packages by category (public)
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const packages = await Package.findAll({ where: { category } });
    const baseUrl = getBaseUrl(req);
    const formatted = packages.map((p) => ({ ...p.toJSON(), image: p.image ? `${baseUrl}${p.image}` : null }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching packages by category:", err);
    res.status(500).json({ message: err.message || "Failed to fetch category packages" });
  }
};

// Create package (admin)
exports.createPackage = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    if (!title || !price || !description) return res.status(400).json({ message: "Title, price, and description required" });

    const image = req.file ? `/uploads/packages/${req.file.filename}` : null;
    const newPackage = await Package.create({ title, price, description, category, image });

    res.status(201).json({ ...newPackage.toJSON(), image: image ? `${getBaseUrl(req)}${image}` : null });
  } catch (err) {
    console.error("Error creating package:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Update package (admin)
exports.updatePackage = async (req, res) => {
  try {
    const packageToUpdate = await Package.findByPk(req.params.id);
    if (!packageToUpdate) return res.status(404).json({ message: "Package not found" });

    const { title, price, description, category } = req.body;
    const image = req.file ? `/uploads/packages/${req.file.filename}` : packageToUpdate.image;

    await packageToUpdate.update({ title, price, description, category, image });
    res.json({ ...packageToUpdate.toJSON(), image: image ? `${getBaseUrl(req)}${image}` : null });
  } catch (err) {
    console.error("Error updating package:", err);
    res.status(500).json({ message: err.message || "Failed to update package" });
  }
};

// Delete package (admin)
exports.deletePackage = async (req, res) => {
  try {
    const packageToDelete = await Package.findByPk(req.params.id);
    if (!packageToDelete) return res.status(404).json({ message: "Package not found" });

    await packageToDelete.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Error deleting package:", err);
    res.status(500).json({ message: err.message || "Failed to delete package" });
  }
};




