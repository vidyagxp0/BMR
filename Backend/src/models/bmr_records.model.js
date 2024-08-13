const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const BMR = require("./bmr.model");

const BMRRecord = sequelize.define("BMR_Record", {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bmr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR,
      key: "bmr_id",
    },
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Initiation",
  },
  stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  reviewers: {
    type: DataTypes.JSON, // Store as an array of reviewers
    allowNull: true,
  },
  approvers: {
    type: DataTypes.JSON, // Store as an array of approvers
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

BMRRecord.belongsTo(BMR, { foreignKey: "bmr_id" });
BMR.hasMany(BMRRecord, { foreignKey: "bmr_id" });

module.exports = BMRRecord;
