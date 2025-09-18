// mind-medicine-backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,   // Database name
  process.env.DB_USER,   // Database username
  process.env.DB_PASS,   // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: "mysql",
    logging: false, // Disable SQL query logs
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

module.exports = sequelize;  // ✅ Only export the Sequelize instance


