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
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    comment: "Detailed description of the package"
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    comment: "Stores file path like /uploads/packages/filename.jpg"
  }
}, {
  tableName: "packages",
  timestamps: false
});

module.exports = Package;

