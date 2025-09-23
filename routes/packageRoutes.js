const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadPackages"); // dedicated multer for packages

// ✅ Get all packages (public route)
router.get("/", packageController.getAllPackages);

// ✅ Create a new package (admin only)
router.post("/", adminMiddleware, upload.single("image"), packageController.createPackage);

// ✅ Update a package by ID (admin only)
router.put("/:id", adminMiddleware, upload.single("image"), packageController.updatePackage);

// ✅ Delete a package by ID (admin only)
router.delete("/:id", adminMiddleware, packageController.deletePackage);

module.exports = router;





