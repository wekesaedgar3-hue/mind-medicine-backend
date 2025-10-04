// models/index.js
const User = require("./User");
const Package = require("./Package");
const Booking = require("./Booking");

// Associations
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Package.hasMany(Booking, { foreignKey: "packageId" });
Booking.belongsTo(Package, { foreignKey: "packageId" });

module.exports = { User, Package, Booking };
