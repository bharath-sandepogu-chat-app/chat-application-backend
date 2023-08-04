const mongoose = require("mongoose");
const Joi = require("joi");

const connectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  connectionStatus: { type: String, required: true }, 
  lastInteractionDate: { type: Date, default: Date.now },
});

const Connection = mongoose.model("Connection", connectionSchema);

const validateConnection = (connection) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    connectionStatus: Joi.string()
      .valid("active", "blocked", "pending")
      .required(),
  });

  return schema.validate(connection);
};

module.exports = {
  Connection,
  validateConnection,
};
