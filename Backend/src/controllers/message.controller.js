const Message = require("../models/messages.model");
const { Op, Sequelize } = require("sequelize");
const User = require("../models/user.model");
const { updateUnreadCount } = require("../middlewares/utils");

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

exports.readAMessage = async (req, res) => {
  try {
    const messageIds = req.body.message_ids;
    const updateResult = await Message.update(
      { isRead: true },
      {
        where: {
          id: {
            [Op.in]: messageIds,
          },
          isRead: false,
        },
      }
    );

    if (updateResult[0] > 0) {
      updateUnreadCount(req.user.userId);
      res.send({ message: "Message marked as read" });
    } else {
      res.send({ message: "No unread message found to update" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error marking message as read",
      error: error.message,
    });
  }
};

exports.getUnreadMesseges = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await Message.findAll({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
      },
    });
    res.json({ messages });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error fetching unread messages",
        error: error.toString(),
      });
  }
};
