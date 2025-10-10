// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Package = require("./Package");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  activities: {
    type: DataTypes.JSONB, // ✅ use JSONB for structured activity data in PostgreSQL
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  receipt: {
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Path to uploaded payment receipt",
  },
}, {
  tableName: "bookings",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

// Associations
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(Package, { foreignKey: "packageId", onDelete: "CASCADE" });

module.exports = Booking;




