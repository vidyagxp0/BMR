const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Department = sequelize.define("Department", {
  department_id: {
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

Department.addHook("afterSync", async () => {
  try {
    const processesCount = await Department.count();
    if (processesCount === 0) {
      await Department.bulkCreate([
        { name: "Coorporate Quality Assurance" },
        { name: "Quality Assurance Biopharma" },
        { name: "Central Quality Control" },
        { name: "Manufacturing" },
        { name: "Plasma Sourcing Group" },
        { name: "Central Stores" },
        { name: "Information Technology Group" },
        { name: "Molecular Medicine" },
        { name: "Central Laboratory" },
        { name: "Tech Team" },
        { name: "Quality Assurance" },
        { name: "Quality Management" },
        { name: "IT Administration" },
        { name: "Accounting" },
        { name: "Logistics" },
        { name: "Senior Management" },
        { name: "Business Administration" },
        { name: "Others" },
        { name: "Quality Control" },
        { name: "Production" },
        { name: "Accounting Manager" },
        { name: "Quality Assurance Director" },
        { name: "Quality Manager" },
        { name: "Supervisor" },
        { name: "Director" },
      ]);
      console.log("Divisons created");
    } else {
      console.log("Divisions already exists");
    }
  } catch (error) {
    console.error("Error inserting divisions:", error);
  }
});

module.exports = Department;
