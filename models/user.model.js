const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  pictureURL: { type: String },
  friendList: [{ type: String, unique: true }],
  connectionStatus: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    pictureURL: Joi.string(),
    friendList: Joi.array().items(Joi.string().email()).unique(),
    connectionStatus: Joi.string().valid(ONLINE, OFFLINE).required(),
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};
