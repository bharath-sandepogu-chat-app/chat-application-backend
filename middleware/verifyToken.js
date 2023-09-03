const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new CustomError(401, "Access denied..."));
  }

  const extractedToken = token.split(" ")[1];

  jwt.verify(
    extractedToken,
    process.env.JWT_ACCESS_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return next(new CustomError(401, "Invalid token"));
      }

      req.user = decoded;
      next();
    }
  );
};

const verifyRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken;

  if (!token) {
    return next(new CustomError(401, "Access denied..."));
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new CustomError(401, "Invalid token"));
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
