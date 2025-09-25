const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadPackages");

// ✅ Public: Get all packages
router.get("/", packageController.getAllPackages);

// ✅ Public: Get packages by category
router.get("/category/:category", packageController.getPackagesByCategory);

// ✅ Admin: Create a new package
router.post(
  "/",
  adminMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  packageController.createPackage
);

// ✅ Admin: Update a package
router.put(
  "/:id",
  adminMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  packageController.updatePackage
);

// ✅ Admin: Delete a package
router.delete("/:id", adminMiddleware, packageController.deletePackage);

module.exports = router;







