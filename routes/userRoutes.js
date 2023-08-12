const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/verifyToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { getUserDetailsController, mailChatRequestController } = require("../controller/userController");

router.get(
  "/me",
  verifyAccessToken,
  asyncErrorHandler(getUserDetailsController)
);

router.post(
  "/mail-chat-request",
  verifyAccessToken,
  asyncErrorHandler(mailChatRequestController)
);

module.exports = router;
