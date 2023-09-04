const {
  getGoogleOAuthURL,
  getGoogleAccessToken,
  getNewAccessToken,
  getDemoUserToken,
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

  const { accessToken, refreshToken, socketToken } = await getGoogleAccessToken(
    code
  );

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      refreshToken,
      socketToken,
    },
  });
};

const getDemoUserTokenController = async (req, res, next) => {
  const tokens = await getDemoUserToken();

  if (!tokens) {
    return next(new CustomError(404, "user not found"));
  }

  const { accessToken, refreshToken, socketToken } = await getDemoUserToken();

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      refreshToken,
      socketToken,
    },
  });
};

const getNewAccessTokenController = (req, res, next) => {
  const newAccessToken = getNewAccessToken(req.user);
  res.status(200).json({
    status: "success",
    data: {
      accessToken: newAccessToken,
    },
  });
};

module.exports = {
  getGoogleAuthController,
  getGoogleAccessTokenController,
  getNewAccessTokenController,
  getDemoUserTokenController,
};
