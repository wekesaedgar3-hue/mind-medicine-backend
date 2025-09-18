const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dynamic storage (separates by category)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    // pick subfolder based on request field (you can adjust this logic)
    if (req.baseUrl.includes("auth")) folder += "profiles/";
    else if (req.baseUrl.includes("packages")) folder += "packages/";
    else if (req.baseUrl.includes("activities")) folder += "activities/";
    else if (req.baseUrl.includes("bookings")) folder += "bookings/";

    // ensure folder exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

// File filter (allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

module.exports = upload;
