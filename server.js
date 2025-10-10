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

// ✅ Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup — allows local + deployed frontends
const allowedOrigins = [
  "http://localhost:5000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://mind-medicine-backend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("⚠️  Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Ensure upload folders exist
["uploads", "uploads/packages", "uploads/bookings", "uploads/profiles"].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Created folder: ${dir}`);
  }
});

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve frontend static files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Import models
require("./models/User");
require("./models/Package");
require("./models/Activity");
require("./models/Booking");

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const activityRoutes = require("./routes/activityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Fallback route for SPA or static files (Express v5 safe)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start server and sync DB
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected & models synced");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 Public folder: ${publicPath}`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));




