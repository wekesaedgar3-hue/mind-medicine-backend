const Package = require("../models/Package");

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

// ✅ Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();

    const baseUrl = getBaseUrl(req);
    const formattedPackages = packages.map((p) => ({
      ...p.toJSON(),
      image: p.image ? `${baseUrl}${p.image}` : null,
    }));

    res.json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch packages" });
  }
};

// ✅ Get packages by category (public)
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const packages = await Package.findAll({ where: { category } });

    const baseUrl = getBaseUrl(req);
    const formattedPackages = packages.map((p) => ({
      ...p.toJSON(),
      image: p.image ? `${baseUrl}${p.image}` : null,
    }));

    res.json(formattedPackages);
  } catch (err) {
    console.error("Error fetching packages by category:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch category packages" });
  }
};

// ✅ Create a new package (admin only)
exports.createPackage = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    if (!title || !price || !description) {
      return res
        .status(400)
        .json({ message: "Title, price, and description are required" });
    }

    const image = req.file ? `/uploads/packages/${req.file.filename}` : null;

    const newPackage = await Package.create({
      title,
      price,
      description,
      category,
      image,
    });

    res.status(201).json({
      ...newPackage.toJSON(),
      image: image ? `${getBaseUrl(req)}${image}` : null,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ Update a package (admin only)
exports.updatePackage = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    const packageToUpdate = await Package.findByPk(req.params.id);

    if (!packageToUpdate) {
      return res.status(404).json({ message: "Package not found" });
    }

    const image = req.file
      ? `/uploads/packages/${req.file.filename}`
      : packageToUpdate.image;

    await packageToUpdate.update({
      title: title || packageToUpdate.title,
      price: price || packageToUpdate.price,
      description: description || packageToUpdate.description,
      category: category || packageToUpdate.category,
      image,
    });

    res.json({
      ...packageToUpdate.toJSON(),
      image: image ? `${getBaseUrl(req)}${image}` : null,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update package" });
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
    res
      .status(500)
      .json({ message: error.message || "Failed to delete package" });
  }
};





