// services/printControl.service.js
const { Op } = require("sequelize");
const PrintControl = require("../models/print_control.model");
const PrintLog = require("../models/Print_logs.model");
const User = require("../models/user.model");
const sequelize = require("../config/db");

// Helper function to get start dates for daily, weekly, monthly, and yearly limits
const getStartDates = () => {
  const now = new Date();
  return {
    startOfDay: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    startOfWeek: new Date(now.setDate(now.getDate() - now.getDay())),
    startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    startOfYear: new Date(now.getFullYear(), 0, 1),
  };
};

// Retrieve active print limits for a user
const getPrintLimits = async (userId) => {
  let printControl = await PrintControl.findOne({
    where: { user_id: userId, isActive: true },
  });

  if (!printControl) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    printControl = await PrintControl.findOne({
      where: { role_id: user.role_id, isActive: true },
    });

    if (!printControl) {
      throw new Error("No print control found for user or their role");
    }
  }

  return printControl;
};

// Get print counts for daily, weekly, monthly, and yearly prints
const getPrintCounts = async (userId) => {
  const { startOfDay, startOfWeek, startOfMonth, startOfYear } =
    getStartDates();

  const dailyCount = await PrintLog.count({
    where: {
      user_id: userId,
      print_time: {
        [Op.gte]: startOfDay,
      },
    },
  });

  const weeklyCount = await PrintLog.count({
    where: {
      user_id: userId,
      print_time: {
        [Op.gte]: startOfWeek,
      },
    },
  });

  const monthlyCount = await PrintLog.count({
    where: {
      user_id: userId,
      print_time: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  const yearlyCount = await PrintLog.count({
    where: {
      user_id: userId,
      print_time: {
        [Op.gte]: startOfYear,
      },
    },
  });

  return { dailyCount, weeklyCount, monthlyCount, yearlyCount };
};

// Check if the user can print and return remaining limits
const canUserPrint = async (userId) => {
  const printControl = await getPrintLimits(userId);
  const counts = await getPrintCounts(userId);

  const limits = {
    daily: printControl.daily,
    weekly: printControl.weekly,
    monthly: printControl.monthly,
    yearly: printControl.yearly,
  };

  const remaining = {
    daily: limits.daily - counts.dailyCount,
    weekly: limits.weekly - counts.weeklyCount,
    monthly: limits.monthly - counts.monthlyCount,
    yearly: limits.yearly - counts.yearlyCount,
  };

  const canPrint =
    remaining.daily > 0 &&
    remaining.weekly > 0 &&
    remaining.monthly > 0 &&
    remaining.yearly > 0;

  return { canPrint, remaining };
};

// Log a print action
const logPrint = async (userId, transaction) => {
  await PrintLog.create({ user_id: userId }, { transaction });
};

// Attempt to print within a transaction, checking limits first
const attemptPrint = async (userId) => {
  return sequelize.transaction(async (t) => {
    const { canPrint, remaining } = await canUserPrint(userId);
    if (!canPrint) {
      throw new Error("Print limit exceeded");
    }
    await logPrint(userId, t);
    return { success: true, remaining };
  });
};

module.exports = {
  canUserPrint,
  attemptPrint,
};
