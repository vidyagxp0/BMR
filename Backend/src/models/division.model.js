const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");

const Division = sequelize.define("Division", {
  division_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Division.addHook("afterSync", async () => {
  try {
    const processesCount = await Division.count();
    if (processesCount === 0) {
      await Division.bulkCreate([
        { name: "India" },
        { name: "Malaysia" },
        { name: "EU" },
        { name: "EMEA" },
      ]);
      console.log("Divisons created");
    } else {
      console.log("Divisions already exists");
    }
  } catch (error) {
    console.error("Error inserting divisions:", error);
  }
});

module.exports = Division;
