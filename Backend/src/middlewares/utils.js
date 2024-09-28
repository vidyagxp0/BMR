const { getIo } = require("../socket");
const Message = require("../models/messages.model");

const updateUnreadCount = async (userId) => {
  const count = await Message.count({
    where: {
      receiverId: userId,
      isRead: false,
    },
  });
  const io = getIo();
  io.to(userId.toString()).emit("updateUnreadCount", count);
};

module.exports = {
  updateUnreadCount,
};
