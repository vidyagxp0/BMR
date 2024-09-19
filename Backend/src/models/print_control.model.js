// const { sequelize } = require("../config/db");
// const { DataTypes } = require("sequelize");
// const Role = require("./role.model");
// const User = require("./user.model");

// const Print_control = sequelize.define(
//   "Print_control",
//   {
//     print_control_id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     role_id: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: Role,
//         key: "role_id",
//       },
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: User,
//         key: "user_id",
//       },
//     },
//     initiator: {
//       type: DataTypes.INTEGER,
//       defaultValue: null,
//       references: {
//         model: User,
//         key: "user_id",
//       },
//     },
//     reviewers: {
//       type: DataTypes.JSON,
//     },
//     approvers: {
//       type: DataTypes.JSON,
//     },
//     stage: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     daily: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     weekly: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     monthly: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     yearly: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//   },
//   {
//     validate: {
//       printLimitsAreValid() {
//         if (this.daily < 0) {
//           throw new Error("Daily print limit must be non-negative");
//         }
//         if (this.weekly < this.daily) {
//           throw new Error(
//             "Weekly print limit must be greater than or equal to the daily limit"
//           );
//         }
//         if (this.monthly < this.weekly) {
//           throw new Error(
//             "Monthly print limit must be greater than or equal to the weekly limit"
//           );
//         }
//         if (this.yearly < this.monthly) {
//           throw new Error(
//             "Yearly print limit must be greater than or equal to the monthly limit"
//           );
//         }
//       },
//     },
//   }
// );

// Print_control.belongsTo(Role, { foreignKey: "role_id" });
// Print_control.belongsTo(User, { foreignKey: "user_id" });
// Print_control.belongsTo(User, { foreignKey: "initiator", as: "InitiatorUser" });

// Role.hasMany(Print_control, { foreignKey: "role_id" });
// User.hasMany(Print_control, { foreignKey: "user_id" });
// User.hasMany(Print_control, {
//   foreignKey: "initiator",
//   as: "InitiatedPrintControls",
// });

// module.exports = Print_control;

// module.exports = Print_control;
