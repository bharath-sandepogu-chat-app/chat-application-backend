const {
  getRecentChatsWithMessages,
  getMoreMessagesFromUser,
} = require("../service/messageService");
const CustomError = require("../utils/customError");

const getUserRecentChatMessagesListController = async (req, res, next) => {
  const userId = req.user.id;

  const data = await getRecentChatsWithMessages(userId);

  res.status(200).json({
    status: "success",
    data,
  });
};

const getMoreMessagesFromUserController = async (req, res, next) => {
  const { messageId, from, to } = req.query;

  if (!messageId || !from || !to) {
    return next(new CustomError(400, "invalid query params"));
  }

  const messages = await getMoreMessagesFromUser(messageId, from, to);

  res.status(200).json({
    status: "success",
    data: messages,
  });
};

module.exports = {
  getUserRecentChatMessagesListController,
  getMoreMessagesFromUserController,
};
