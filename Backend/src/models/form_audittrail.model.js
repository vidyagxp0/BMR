const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");
const BMR = require("./bmr.model");

const FormAuditTrail = sequelize.define("FormAuditTrail", {
  auditTrail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bmr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR,
      key: "bmr_id",
    },
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  field_name: {
    type: DataTypes.STRING,
  },
  previous_value: {
    type: DataTypes.STRING,
  },
  new_value: {
    type: DataTypes.STRING,
  },
  previous_status: {
    type: DataTypes.STRING,
  },
  new_status: {
    type: DataTypes.STRING,
  },
  declaration: {
    type: DataTypes.STRING,
  },
  comments: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
  },
});

FormAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(FormAuditTrail, { foreignKey: "changed_by" });

FormAuditTrail.belongsTo(BMR, {
  foreignKey: "bmr_id",
});
BMR.hasMany(FormAuditTrail, {
  foreignKey: "bmr_id",
});

module.exports = FormAuditTrail;
