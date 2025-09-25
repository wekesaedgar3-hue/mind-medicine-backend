// mind-medicine-backend/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  fullName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { isEmail: true }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM("user", "admin"), 
    defaultValue: "user"   // <-- role column with default "user"
  },
  profilePic: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;




