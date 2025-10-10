const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authController = require("../controllers/authController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// ✅ Multer setup for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only images are allowed!"));
  },
});

// ✅ Public routes
router.post("/register", upload.single("profilePic"), authController.register);
router.post("/login", authController.login);

// ✅ Authenticated route (to verify current session)
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = req.user; // this comes from authenticate middleware
    res.json({
      id: user.id,
      fullName: user.fullName,          // <-- now always returns fullName
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || null,
    });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Example admin route
router.get("/admin-only", authenticate, isAdmin, (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

module.exports = router;




