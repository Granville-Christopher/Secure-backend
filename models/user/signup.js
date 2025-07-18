// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../db"); 

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;
