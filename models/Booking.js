const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Import models for associations
const User = require("./User");
const Package = require("./Package");
const Activity = require("./Activity");

const Booking = sequelize.define("Booking", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  packageId: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  activityId: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending",
  },
  receipt: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Stores file path like /uploads/bookings/filename.jpg"
  }
}, {
  tableName: "bookings",
  timestamps: false
});

// ================= ASSOCIATIONS ================= //
Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Package, { foreignKey: "packageId" });
Booking.belongsTo(Activity, { foreignKey: "activityId" });

User.hasMany(Booking, { foreignKey: "userId" });
Package.hasMany(Booking, { foreignKey: "packageId" });
Activity.hasMany(Booking, { foreignKey: "activityId" });

module.exports = Booking;


