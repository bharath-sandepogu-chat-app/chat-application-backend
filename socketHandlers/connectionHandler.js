const { ONLINE, TYPING, OFFLINE } = require("../utils/modalConstants");

const connectionHandler = (io, socket) => {
  const intervalId = setInterval(() => {
    io.emit(`userStatus`, socket.user.id, ONLINE);
  }, 2000);

  socket.join(socket.user.id);

  socket.on("typingStatus", (from, to, callback) => {
    socket.to(to).emit("typingStatus", from, TYPING);
    callback(null, "received typing status event");
  });

  socket.on("disconnect", async (reason) => {
    const matchingSockets = await io.in(socket.user.id).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit(`userStatus`, socket.user.id, OFFLINE);
      clearInterval(intervalId);
    }
  });
};

module.exports = connectionHandler;
