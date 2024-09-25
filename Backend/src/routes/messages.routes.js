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

module.exports = router;
