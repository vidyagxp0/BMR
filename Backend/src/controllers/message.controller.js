const Message = require("../models/messages.model");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/user.model");

exports.getRecentChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recentChats = await Message.findAll({
      attributes: ["senderId", "receiverId", "message", "createdAt"],
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["user_id", "name"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["user_id", "name"],
        },
      ],
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        createdAt: {
          [Op.eq]: Sequelize.literal(`(
              SELECT MAX(createdAt)
              FROM Messages AS latestMessage
              WHERE
                (latestMessage.senderId = Message.senderId AND latestMessage.receiverId = Message.receiverId)
                OR
                (latestMessage.senderId = Message.receiverId AND latestMessage.receiverId = Message.senderId)
            )`),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(recentChats);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.getAllMessagesBetweenTwoUsers = async (req, res) => {
  try {
    const result = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.userId, receiverId: req.params.Id },
          { senderId: req.params.Id, receiverId: req.user.userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      error: false,
      message: result,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
