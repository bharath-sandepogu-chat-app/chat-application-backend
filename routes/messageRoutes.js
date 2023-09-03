const express = require("express");
const router = express.Router();

// controllers
const {
  getUserRecentChatMessagesListController,
} = require("../controller/messageController");

// utils and middleWares
const { verifyAccessToken } = require("../middleware/verifyToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

router.get(
  "/messages",
  verifyAccessToken,
  asyncErrorHandler(getUserRecentChatMessagesListController)
);

module.exports = router;
