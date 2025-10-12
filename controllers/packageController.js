const fs = require("fs");
const path = require("path");
const Package = require("../models/Package");

// ✅ Smart base URL resolver (works locally & on Render)
const getBaseUrl = (req) => {
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  return `${req.protocol}://${req.get("host")}`;
};

// ✅ Helper to move uploaded file to /public/images/packages
const moveToPublic = (file, folder) => {
  if (!file) return null;
  const publicDir = path.join(__dirname, "..", "public", "images", folder);
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const newPath = path.join(publicDir, file.filename);
  fs.renameSync(file.path, newPath);

  // Return the public path (for frontend access)
  return `/images/${folder}/${file.filename}`;
};

// ✅ Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    const baseUrl = getBaseUrl(req);

    const formatted = packages.map((p) => ({
      ...p.toJSON(),
      image: p.image
        ? `${baseUrl}${p.image.startsWith("/") ? p.image : "/" + p.image}`
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching packages:", err);
    res.status(500).json({ message: err.message || "Failed to fetch packages" });
  }
};

// ✅ Create package (admin)
exports.createPackage = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    if (!title || !price || !description)
      return res.status(400).json({ message: "Title, price, and description required" });

    // Save uploaded file to /public/images/packages
    const image = req.file ? moveToPublic(req.file, "packages") : null;

    const newPackage = await Package.create({ title, price, description, category, image });
    const baseUrl = getBaseUrl(req);

    res.status(201).json({
      ...newPackage.toJSON(),
      image: image ? `${baseUrl}${image}` : null,
    });
  } catch (err) {
    console.error("Error creating package:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Update package (admin)
exports.updatePackage = async (req, res) => {
  try {
    const packageToUpdate = await Package.findByPk(req.params.id);
    if (!packageToUpdate)
      return res.status(404).json({ message: "Package not found" });

    const { title, price, description, category } = req.body;
    const image = req.file
      ? moveToPublic(req.file, "packages")
      : packageToUpdate.image;

    await packageToUpdate.update({ title, price, description, category, image });

    const baseUrl = getBaseUrl(req);
    res.json({
      ...packageToUpdate.toJSON(),
      image: image ? `${baseUrl}${image}` : null,
    });
  } catch (err) {
    console.error("Error updating package:", err);
    res.status(500).json({ message: err.message || "Failed to update package" });
  }
};

// ✅ Delete package (admin)
exports.deletePackage = async (req, res) => {
  try {
    const packageToDelete = await Package.findByPk(req.params.id);
    if (!packageToDelete)
      return res.status(404).json({ message: "Package not found" });

    await packageToDelete.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Error deleting package:", err);
    res.status(500).json({ message: err.message || "Failed to delete package" });
  }
};


