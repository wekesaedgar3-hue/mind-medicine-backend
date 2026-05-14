// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Package = require("./Package");
const Activity = require("./Activity");

const dialect = sequelize.getDialect();
const activitiesType =
  dialect === "postgres" || dialect === "postgresql"
    ? DataTypes.JSONB
    : dialect === "mysql" || dialect === "mariadb"
      ? DataTypes.JSON
      : dialect === "mssql"
        ? DataTypes.TEXT
        : DataTypes.JSON;

const Booking = sequelize.define(
  "Booking",
  {
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
      type: activitiesType,
      allowNull: true,
    },
    bookingType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "package",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    transactionReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    schema: "dbo",
  },
);

// Associations
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(Package, { foreignKey: "packageId", onDelete: "CASCADE" });
Booking.belongsTo(Activity, { foreignKey: "activityId", onDelete: "CASCADE" });

module.exports = Booking;
