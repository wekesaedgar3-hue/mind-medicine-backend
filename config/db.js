// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Use DATABASE_URL (Render / production)
  console.log("🔗 Using DATABASE_URL for Postgres connection");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // ✅ Use local environment variables
  console.log("🔗 Using local DB config");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: process.env.DB_DIALECT || "postgres",
      logging: false,
    }
  );
}

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to Postgres successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = sequelize;






