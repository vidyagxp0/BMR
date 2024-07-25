const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BMR = require("./bmr.model");

const BMR_Tab = sequelize.define("BMR_Tab", {
  bmr_tab_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tab_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bmr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BMR,
      key: "bmr_id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});


BMR_Tab.belongsTo(BMR, { foreignKey: "bmr_id" });
BMR.hasMany(BMR_Tab, { foreignKey: "bmr_id" });


module.exports = BMR_Tab;
