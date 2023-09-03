const jwt = require("jsonwebtoken");

const verifySocketConnection = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("invalid request: token required for connection"));
  }

  jwt.verify(token, process.env.JWT_SOCKET_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Invalid token"));
    }

    socket.user = decoded;

    next();
  });
};

module.exports = {
  verifySocketConnection,
};
