// models/index.js
const User = require("./User");
const Package = require("./Package");
const Booking = require("./Booking");
const Activity = require("./Activity");

// Associations
User.hasMany(Booking, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId" });

Package.hasMany(Booking, { foreignKey: "packageId", onDelete: "CASCADE" });
Booking.belongsTo(Package, { foreignKey: "packageId" });

module.exports = { User, Package, Booking, Activity };
