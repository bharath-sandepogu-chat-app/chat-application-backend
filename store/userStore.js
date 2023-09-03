const { User } = require("../models/user.model");

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

const updateUserFriendList = async (id, friendEmail) => {
  await User.updateOne({ _id: id }, { $addToSet: { friendList: friendEmail } });
};

const findUserFriendDetailsList = async (id) => {
  const userData = await User.findById(id);
  const emailsToSearch = userData.friendList;

  const friendListDetails = User.find(
    { email: { $in: emailsToSearch } },
    { email: 1, firstName: 1, lastName: 1, pictureURL: 1, userName: 1 }
  );

  return friendListDetails;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserFriendList,
  findUserFriendDetailsList,
};
