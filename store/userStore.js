const { User, validateUser } = require("../models/user.model");

const createUser = async (dataToInsert) => {
  const createdUserData = await User.create(dataToInsert);
  return createdUserData;
};

const findUserByEmail = async (email) => {
  const userData = await User.findOne({ email: email });
  return userData;
};

const findUserById = async (id) => {
  const userData = await User.findById(id);
  return userData;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
