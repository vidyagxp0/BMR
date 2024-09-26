const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");
const PrintControl = require("./print_control.model");

const PrintControlAuditTrail = sequelize.define("PrintControlAuditTrail", {
  pcauditTrail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  print_control_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PrintControl,
      key: "print_control_id",
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

PrintControlAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(PrintControlAuditTrail, { foreignKey: "changed_by" });

PrintControlAuditTrail.belongsTo(PrintControl, {
  foreignKey: "print_control_id",
});
PrintControl.hasMany(PrintControlAuditTrail, {
  foreignKey: "print_control_id",
});

module.exports = PrintControlAuditTrail;
