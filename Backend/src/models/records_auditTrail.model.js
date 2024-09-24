const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");
const BMR_Records = require("./bmr_records.model");

const RecordAuditTrail = sequelize.define("RecordAuditTrail", {
  auditTrail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bmr_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR_Records,
      key: "bmr_record_id",
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
    allowNull: true,
  },
  new_value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  previous_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  new_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  declaration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

RecordAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(RecordAuditTrail, { foreignKey: "changed_by" });

RecordAuditTrail.belongsTo(BMR_Records, {
  foreignKey: "bmr_record_id",
});
BMR_Records.hasMany(RecordAuditTrail, {
  foreignKey: "bmr_record_id",
});

module.exports = RecordAuditTrail;
