const mongoose = require("mongoose");
const Joi = require("joi");
const { SEND, DELIVERED, READ } = require("../utils/modalConstants");

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, default: Date.now },
  messageStatus: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

const validateMessage = (message) => {
  const schema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    content: Joi.string().required(),
    timestamp: Joi.number().required(),
    messageStatus: Joi.string().valid(SEND, DELIVERED, READ).required(),
  });

  return schema.validate(message);
};

module.exports = {
  Message,
  validateMessage,
};
