const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db");

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET environment variable!");
  process.exit(1);
}

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "*", // or replace "*" with your frontend domain for more security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Ensure upload folders exist
["uploads", "uploads/packages", "uploads/bookings"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Created folder: ${dir}`);
  }
});

// ✅ Serve uploaded files (images, receipts, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve frontend static files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Import Models
require("./models/User");
require("./models/Package");
require("./models/Activity");
require("./models/Booking");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const activityRoutes = require("./routes/activityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Fallback route for SPA
app.use((req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Sync DB and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected and models synced (with alter)");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📂 Serving uploads from: http://localhost:${PORT}/uploads`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));














