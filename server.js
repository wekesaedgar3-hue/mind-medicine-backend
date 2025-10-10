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

// ✅ Express JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup (Allow local + both Render apps)
const allowedOrigins = [
  "http://localhost:5500", // Local Live Server
  "http://127.0.0.1:5500", // Alternate local
  "http://localhost:5000", // Local backend
  "https://mind-medicine-backend.onrender.com", // Backend Render
  "https://mindandmedicineholidays.onrender.com" // Frontend Render
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
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
  "uploads/activities",
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

// ✅ Import all models (for associations)
["User", "Package", "Activity", "Booking"].forEach((model) =>
  require(`./models/${model}`)
);

// ✅ Auto-load all routes
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace("Routes.js", "").toLowerCase();
    app.use(`/api/${routeName}`, route);
    console.log(`✅ Mounted route: /api/${routeName}`);
  }
});

// ✅ Ensure /api/auth is explicitly mounted (important for login)
app.use("/api/auth", require("./routes/authRoutes"));

// ✅ Serve frontend ONLY for non-API routes
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


