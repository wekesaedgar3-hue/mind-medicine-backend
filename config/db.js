// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "mysql";
const isPostgres = dialect === "postgres" || dialect === "postgresql";
const isMSSQL = dialect === "mssql";
const useMssqlWindowsAuth = isMSSQL && process.env.DB_AUTH_TYPE === "ntlm";

const mssqlDialectOptions = {
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

if (useMssqlWindowsAuth) {
  mssqlDialectOptions.authentication = {
    type: "ntlm",
    options: {
      domain: process.env.DB_DOMAIN || "",
      userName: process.env.DB_USER || "",
      password: process.env.DB_PASS || "",
    },
  };
}

const baseConfig = {
  dialect,
  logging: false,
  dialectOptions: isPostgres
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : isMSSQL
      ? mssqlDialectOptions
      : {},
};

let sequelize;

if (process.env.DATABASE_URL) {
  console.log(`🔗 Using DATABASE_URL for ${dialect.toUpperCase()} connection`);
  sequelize = new Sequelize(process.env.DATABASE_URL, baseConfig);
} else {
  console.log(`🔗 Using local ${dialect.toUpperCase()} config`);

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || null,
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || (isPostgres ? 5432 : isMSSQL ? 1433 : 3306),
      ...baseConfig,
    },
  );
}

// Test connection
sequelize
  .authenticate()
  .then(() =>
    console.log(`✅ Connected to ${dialect.toUpperCase()} successfully`),
  )
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = sequelize;
