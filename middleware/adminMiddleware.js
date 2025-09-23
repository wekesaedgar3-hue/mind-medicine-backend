// middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header (format: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Not authenticated" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request

    // Check if role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "You must be logged in as an admin to access this page!" });
    }

    next(); // user is admin, continue
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminMiddleware;
