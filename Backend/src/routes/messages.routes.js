const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const Auth = require("../middlewares/authentication");

router.get(
  "/get-recent-chats",
  Auth.checkJwtToken,
  messageController.getRecentChats
);

router.get(
  "/messages/:Id",
  Auth.checkJwtToken,
  messageController.getAllMessagesBetweenTwoUsers
);

router.put(
  "/read-message",
  Auth.checkJwtToken,
  messageController.readAMessage
);

router.get(
  "/unread-messages",
  Auth.checkJwtToken,
  messageController.getUnreadMesseges
);

module.exports = router;
