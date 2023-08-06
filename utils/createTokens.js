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

module.exports = {
  createAccessToken,
  createRefreshToken,
};
