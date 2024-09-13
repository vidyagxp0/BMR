const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");

const Notifications = sequelize.define("Notifications", {
  notification_id: {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSON,
  }
});

Notifications.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Notifications, { foreignKey: "user_id" });

module.exports = Notifications;
