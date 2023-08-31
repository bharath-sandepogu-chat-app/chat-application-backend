const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/verifyToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const {
  getUserDetailsController,
  mailChatRequestController,
  getFriendDetailsListController,
} = require("../controller/userController");
const {
  getUserRecentChatMessagesListController,
  getMoreMessagesFromUserController,
} = require("../controller/messageController");

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

router.get(
  "/friend-details-list",
  verifyAccessToken,
  asyncErrorHandler(getFriendDetailsListController)
);

router.get(
  "/messages",
  verifyAccessToken,
  asyncErrorHandler(getUserRecentChatMessagesListController)
);

router.get(
  "/messages/more",
  verifyAccessToken,
  asyncErrorHandler(getMoreMessagesFromUserController)
);

module.exports = router;
