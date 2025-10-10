// ✅ server.js — Mind & Medicine Holidays Backend
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db");

// ✅ Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET environment variable!");
  process.exit(1);
}

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup (Allow local + Render apps)
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5000",
  "https://mind-medicine-backend.onrender.com",
  "https://mindandmedicineholidays.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("⚠️ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Ensure uploads folders exist
[
  "uploads",
  "uploads/packages",
  "uploads/bookings",
  "uploads/profiles",
  "uploads/activities"
].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Created folder: ${dir}`);
  }
});

// ✅ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Import models
["User", "Package", "Activity", "Booking"].forEach((model) =>
  require(`./models/${model}`)
);

// ✅ Import route files
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const activityRoutes = require("./routes/activityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);

console.log("✅ Routes mounted: /api/auth, /api/packages, /api/activities, /api/bookings");

// ✅ Serve frontend (for non-API routes)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Connect Database & Start Server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected & models synced successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 Serving frontend from: ${publicPath}`);
    });
  })
  .catch((err) => console.error("❌ Database connection error:", err));


