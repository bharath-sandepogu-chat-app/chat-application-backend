const { findUserById } = require("../store/userStore");

const getUserDetailsById = async (id) => {
  const userDetails = await findUserById(id);
  if (!userDetails) {
    throw new CustomError(404, "User not found...");
  }
  return userDetails;
};

module.exports = {
  getUserDetailsById,
};
