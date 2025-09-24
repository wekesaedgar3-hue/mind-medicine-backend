// routes/packageRoutes.js
const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadPackages");

// ✅ Get all packages (public route)
router.get("/", packageController.getAllPackages);

// ✅ Create a new package (admin only) with Multer error handling
router.post(
  "/",
  adminMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        // Multer error (wrong type, too big, etc.)
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  packageController.createPackage
);

// ✅ Update a package by ID (admin only) with Multer error handling
router.put(
  "/:id",
  adminMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  packageController.updatePackage
);

// ✅ Delete a package by ID (admin only)
router.delete("/:id", adminMiddleware, packageController.deletePackage);

module.exports = router;






