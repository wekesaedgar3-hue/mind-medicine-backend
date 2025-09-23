const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
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
const adminRoutes = require("./routes/adminRoutes"); // ✅ import admin routes

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes); // ✅ mount admin routes

// ✅ Fallback route for SPA (so React/Vanilla frontend routes work)
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

    // ✅ Use Render’s dynamic PORT if available, and listen on 0.0.0.0
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));















