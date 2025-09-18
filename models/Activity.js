const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Activity = sequelize.define("Activity", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  location: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Stores file path like /uploads/activities/filename.jpg"
  }
}, {
  tableName: "activities",
  timestamps: false
});

module.exports = Activity;

