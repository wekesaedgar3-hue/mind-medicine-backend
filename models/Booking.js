const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Package = require("./Package");

const Booking = sequelize.define("Booking", {
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  activities: {
    type: DataTypes.TEXT, // stored as JSON string
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  receipt: {
    type: DataTypes.STRING, // ✅ file path to uploaded receipt
    allowNull: true,
  },
});

// Associations
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(Package, { foreignKey: "packageId", onDelete: "CASCADE" });

module.exports = Booking;



