const jwt = require("jsonwebtoken");

const createAccessToken = ({ id, email }) => {
  const accessToken = jwt.sign(
    { id, email, tokenType: "access" },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return accessToken;
};

const createRefreshToken = ({ id, email }) => {
  const refreshToken = jwt.sign(
    {
      id,
      email,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
};

const createSocketToken = ({ id, email }) => {
  const socketToken = jwt.sign(
    {
      id,
      email,
      tokenType: "socket",
    },
    process.env.JWT_SOCKET_SECRET_KEY,
    {
      expiresIn: "1y",
    }
  );

  return socketToken;
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createSocketToken,
};
