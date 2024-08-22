const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const BMR = sequelize.define("BMR", {
  bmr_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  stage: {
    type: DataTypes.INTEGER,
  },
  initiator: {
    type: DataTypes.INTEGER
  },
  reviewers: {
    type: DataTypes.JSON
  },
  approvers: {
    type: DataTypes.JSON
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  initiatorComment: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});


module.exports = BMR;
