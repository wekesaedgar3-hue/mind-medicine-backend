const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Package = sequelize.define("Package", {
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
    type: DataTypes.STRING, // ✅ store relative file path (e.g. /uploads/packages/file.jpg)
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING, // ✅ optional, for filtering categories
    allowNull: true,
  },
});

module.exports = Package;

