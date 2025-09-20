// mind-medicine-backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// quick debug log (will appear in Render logs)
console.log("DB_DIALECT=", process.env.DB_DIALECT);
console.log("DB_HOST=", process.env.DB_HOST);
console.log("DB_NAME=", process.env.DB_NAME);
console.log("DB_USER=", process.env.DB_USER ? "SET" : "MISSING");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres", // ensure postgres fallback
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 30000
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to Postgres successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = sequelize;




