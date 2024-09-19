// const PrintControl = require("../models/print_control.model");

// exports.CreatePrintControl = async (req, res) => {
//   const { role_id, user_id, daily, weekly, monthly, yearly } = req.body;

//   if (!role_id && !user_id) {
//     return res.status(400).json({
//       error: true,
//       message: "Please provide proper details",
//     });
//   }

//   const Printcontrol = await PrintControl.create({
//     role_id: role_id,
//     user_id: user_id,
//     daily: daily,
//     weekly: weekly,
//     monthly: monthly,
//     yearly: yearly,
//   });
// };
