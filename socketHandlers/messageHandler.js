const {
  addMessage,
  updateUnReadMessages,
  updateDeliveryMessageStatus,
} = require("../service/messageService");
const { getUserDetailsById } = require("../service/userService");

const messageHandler = (io, socket) => {
  socket.on("privateMessage", async (message, callback) => {
    try {
      const firstMessage = message.isFirstMessage;

      if (firstMessage) {
        const fromUser = await getUserDetailsById(message.from);
        const { _id, userName, email, firstName, lastName, pictureURL } =
          fromUser;
        const newFromUserDetailsToSend = {
          _id,
          userName,
          email,
          firstName,
          lastName,
          pictureURL,
        };
        const updatedMessage = await addMessage(message);
        callback(null, updatedMessage);
        socket
          .to(message.from)
          .to(message.to)
          .emit("privateMessage", updatedMessage, newFromUserDetailsToSend);
      } else {
        const updatedMessage = await addMessage(message);
        callback(null, updatedMessage);
        socket
          .to(message.from)
          .to(message.to)
          .emit("privateMessage", updatedMessage);
      }
    } catch (error) {
      callback(error, null);
    }
  });

  socket.on("readMessage", async ({ from, to }, callback) => {
    try {
      const updatedMessages = await updateUnReadMessages(from, to);
      callback(null, updatedMessages);
      socket.to(from).emit("readMessage", to);
    } catch (error) {
      callback(error, null);
    }
  });

  socket.on("deliveredMessageStatus", async (messageObj, callback) => {
    try {
      const updatedMessage = await updateDeliveryMessageStatus(messageObj._id);
      callback(
        null,
        `updated message status to delivered ${updatedMessage._id}`
      );
      socket.to(messageObj.from).emit("deliveredMessageStatus", updatedMessage);
    } catch (error) {
      callback(error, null);
    }
  });
};

module.exports = messageHandler;
