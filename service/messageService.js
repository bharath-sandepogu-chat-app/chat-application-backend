const { validateMessage } = require("../models/message.model");
const {
  createMessage,
  recentChatsWithMessages,
  updateAllUnReadMessageStatus,
  moreMessagesFromUser,
} = require("../store/messageStore");
const { SEND, READ } = require("../utils/modalConstants");
const CustomError = require("../utils/customError");

const addMessage = async (messageDetails) => {
  const messageDetailsObj = {
    from: messageDetails?.from,
    to: messageDetails?.to,
    content: messageDetails?.content,
    timestamp: messageDetails?.timestamp,
    messageStatus: SEND,
  };

  const { error, value } = validateMessage(messageDetailsObj);

  if (error) {
    throw new CustomError(400, "invalid message details...");
  }

  const addedMessage = await createMessage(messageDetailsObj);

  return addedMessage;
};

const getRecentChatsWithMessages = async (userId) => {
  const recentChatsData = await recentChatsWithMessages(userId);

  return recentChatsData;
};

const updateUnReadMessages = async (from, to) => {
  const updatedMessages = await updateAllUnReadMessageStatus(from, to, READ);
  return updatedMessages;
};

const getMoreMessagesFromUser = async (messageId, from, to) => {
  const moreMessages = await moreMessagesFromUser(messageId, from, to);

  return moreMessages;
};

module.exports = {
  addMessage,
  getRecentChatsWithMessages,
  updateUnReadMessages,
  getMoreMessagesFromUser,
};
