const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./department.model");
const Division = require("./division.model");

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
    type: DataTypes.INTEGER,
  },
  reviewers: {
    type: DataTypes.JSON,
  },
  approvers: {
    type: DataTypes.JSON,
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: "department_id",
    },
  },
  description: {
    type :DataTypes.STRING,
    allowNull: false
  },
  division_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Division,
      key: "division_id",
    },
  },
  initiatorComment: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

BMR.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(BMR, { foreignKey: "department_id" });
BMR.belongsTo(Division, { foreignKey: "division_id" });
Division.hasMany(BMR, { foreignKey: "division_id" });

module.exports = BMR;
