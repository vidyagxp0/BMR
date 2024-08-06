const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BMR_Tab = require("./bmr_tabs.model");
const BMR = require("./bmr.model");

const BMR_section = sequelize.define("BMR_section", { 
  bmr_section_id: {
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
  section_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

BMR_section.belongsTo(BMR_Tab, { foreignKey: "bmr_tab_id" });
BMR_section.belongsTo(BMR, { foreignKey: "bmr_id" });

BMR.hasMany(BMR_section, { foreignKey: "bmr_id" });
BMR_Tab.hasMany(BMR_section, { foreignKey: "bmr_tab_id" });

module.exports = BMR_section;
