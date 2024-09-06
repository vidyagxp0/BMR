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

// Department.addHook("afterSync", async () => {
//     try {
//       const processesCount = await User.count();
//       const salt = await bcrypt.genSalt(10);
//       const hashpass = await bcrypt.hash("Amit@121", salt);
//       if (processesCount === 0) {
//         await User.bulkCreate([
//           { name: "Admin", email: "admin@vidyagxp.com", password: hashpass },
//         ]);
//         console.log("Admin User created");
//       } else {
//         console.log("Admin User already exist");
//       }
//     } catch (error) {
//       console.error("Error creating Admin User:", error);
//     }
//   });

module.exports = Department;
