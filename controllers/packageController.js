const Package = require("../models/Package");

exports.createPackage = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const image = req.file ? `/uploads/packages/${req.file.filename}` : null;

    const pkg = await Package.create({
      title,
      description,
      price,
      image,
    });

    res.status(201).json({ message: "Package created", pkg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
