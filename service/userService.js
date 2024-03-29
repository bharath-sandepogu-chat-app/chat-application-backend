const {
  findUserById,
  updateUserFriendList,
  findUserFriendDetailsList,
} = require("../store/userStore");
const { sendMail } = require("../config/nodemailer.js");

const getUserDetailsById = async (id) => {
  const userDetails = await findUserById(id);
  if (!userDetails) {
    throw new CustomError(404, "User not found...");
  }
  return userDetails;
};

const mailChatRequest = async (id, toEmail) => {
  await updateUserFriendList(id, toEmail);
  await sendMail(toEmail);
  return `sent mail to ${toEmail}`;
};

const getFriendDetailsList = async (id) => {
  const resList = await findUserFriendDetailsList(id);
  return resList;
};

module.exports = {
  getUserDetailsById,
  mailChatRequest,
  getFriendDetailsList,
};
