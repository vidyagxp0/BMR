// models/printLog.model.js
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");

const PrintLog = sequelize.define("PrintLog", {
  print_log_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  print_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Relations
PrintLog.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(PrintLog, { foreignKey: "user_id" });

module.exports = PrintLog;
