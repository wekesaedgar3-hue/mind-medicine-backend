// models/Package.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Package = sequelize.define("Package", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Path to uploaded package image (e.g. /uploads/packages/file.jpg)"
  },
  category: {
    type: DataTypes.STRING, 
    allowNull: true,
  }
}, {
  tableName: "packages",
  timestamps: false
});

module.exports = Package;

