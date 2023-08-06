const { getUserDetailsById } = require("../service/userService");
const CustomError = require("../utils/customError");

const getUserDetailsController = async (req, res, next) => {
  const userDetails = await getUserDetailsById(req.user.id);
  res.status(200).json(userDetails);
};

module.exports = {
  getUserDetailsController,
};
