// mind-medicine-backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // ✅ serve uploaded files

// Serve frontend static files (put your frontend inside "public" folder)
app.use(express.static(path.join(__dirname, "public")));

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

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Fallback route for SPA (Express 5 fix)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Sync DB and start server
sequelize
  .sync({ alter: true }) // ✅ auto-update tables to match models
  .then(() => {
    console.log("✅ Database connected and models synced (with alter)");
    const PORT = process.env.PORT || 5000; // ✅ use Render’s PORT
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));










