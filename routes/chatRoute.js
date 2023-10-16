const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();

// chat is a conversation
router.get("/:userId", authController.protect, messageController.getAllChats);
router.post(
  "/:senderId/:receiverId",
  authController.protect,
  messageController.postChat
);
router.get(
  "/:firstId/:secendId",
  authController.protect,
  messageController.getChat
);

// A conversation has mutiple messages
router.post("/messages", authController.protect, messageController.postMessage);
router.get(
  "/messages/:chatId",
  authController.protect,
  messageController.getMessages
);

module.exports = router;
