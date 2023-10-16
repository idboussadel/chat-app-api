const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const { catchAsync } = require("./errorController");

exports.postMessage = catchAsync(async (req, res, next) => {
  const { chatId, senderId, text } = req.body;
  const msg = await Message.create({
    chatId,
    senderId,
    text,
  });

  res.status(201).json({ status: "succes", msg });
});

exports.getMessages = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const result = await MessageModel.find({ chatId });
  res.status(201).json({ status: "succes", result });
});

exports.postChat = catchAsync(async (req, res) => {
  const { senderId, receiverId } = req.params;
  const chat = await Chat.create({
    members: [senderId, receiverId],
  });
  res.status(201).json({ status: "succes", chat });
});

exports.getAllChats = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const chats = await Chat.find({ members: { $in: [userId] } });
  res.status(200).json({ status: "success", chats });
});

exports.getChat = catchAsync(async (req, res) => {
  const { firstId, secendId } = req.params;
  const chats = await Chat.find({ members: { $all: [firstId, secendId] } });
  res.status(200).json({ status: "success", chats });
});
