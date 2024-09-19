const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BMR_Tab = require("./bmr_tabs.model");
const BMR = require("./bmr.model");
const BMR_section = require("./bmr_sections.model");

const BMR_field = sequelize.define("BMR_field", {
  bmr_field_id: {
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
  bmr_tab_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR_Tab,
      key: "bmr_tab_id",
    },
  },
  bmr_section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR_section,
      key: "bmr_section_id",
    },
  },
  field_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  placeholder: {
    type: DataTypes.STRING,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  defaultValue: {
    type: DataTypes.STRING,
  },
  helpText: {
    type: DataTypes.STRING,
  },
  minValue: {
    type: DataTypes.INTEGER,
  },
  maxValue: {
    type: DataTypes.INTEGER,
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
  },
  isReadOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  acceptsMultiple: {
    type: DataTypes.JSON,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

BMR_field.belongsTo(BMR_Tab, { foreignKey: "bmr_tab_id" });
BMR_field.belongsTo(BMR, { foreignKey: "bmr_id" });
BMR_field.belongsTo(BMR_section, { foreignKey: "bmr_section_id" });

BMR.hasMany(BMR_field, { foreignKey: "bmr_id" });
BMR_Tab.hasMany(BMR_field, { foreignKey: "bmr_tab_id" });
BMR_section.hasMany(BMR_field, { foreignKey: "bmr_section_id" });

module.exports = BMR_field;
