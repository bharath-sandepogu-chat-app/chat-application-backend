const {
  getGoogleOAuthURL,
  getGoogleAccessToken,
  getNewAccessToken,
} = require("../service/authService");
const CustomError = require("../utils/customError");

const getGoogleAuthController = (req, res, next) => {
  const googleOAuthURL = getGoogleOAuthURL();

  res.status(200).json({
    status: "success",
    data: googleOAuthURL,
  });
};

const getGoogleAccessTokenController = async (req, res, next) => {
  const code = req.query.code;

  if (!req.query.code) {
    return next(new CustomError(400, "Missing required query parameter: code"));
  }

  const { accessToken, refreshToken } = await getGoogleAccessToken(code);

  res.status(200).json({
    accessToken,
    refreshToken,
  });
};

const getNewAccessTokenController = (req, res, next) => {
  const newAccessToken = getNewAccessToken(req.user);
  res.status(200).json({
    accessToken: newAccessToken,
  });
};

module.exports = {
  getGoogleAuthController,
  getGoogleAccessTokenController,
  getNewAccessTokenController,
};
