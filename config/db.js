const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use DATABASE_URL directly
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Render/Postgres often needs this
    },
  },
  logging: false, // turn off SQL query logs
});

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to Postgres successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = sequelize;





