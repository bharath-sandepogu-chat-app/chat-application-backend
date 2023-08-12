const {
  getUserDetailsById,
  mailChatRequest,
} = require("../service/userService");
const CustomError = require("../utils/customError");

const getUserDetailsController = async (req, res, next) => {
  const userDetails = await getUserDetailsById(req.user.id);
  res.status(200).json({
    status: "success",
    data: userDetails,
  });
};

const mailChatRequestController = async (req, res, next) => {
  const toEmail = req.body.toEmail;
  const id = req.user.id;

  if (!toEmail) {
    next(new CustomError(400, "Missing field in payload: toEmail"));
  }

  const mailResponse = await mailChatRequest(id, toEmail);

  res.status(200).json({
    status: "success",
    body: mailResponse,
  });
};

module.exports = {
  getUserDetailsController,
  mailChatRequestController,
};
