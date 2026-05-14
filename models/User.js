// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const dialect = sequelize.getDialect();
const roleType =
  dialect === "mssql" ? DataTypes.STRING : DataTypes.ENUM("user", "admin");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: roleType,
      defaultValue: "user",
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    schema: "dbo",
  },
);

module.exports = User;
