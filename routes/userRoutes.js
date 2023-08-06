const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/verifyToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { getUserDetailsController } = require("../controller/userController");

router.get(
  "/me",
  verifyAccessToken,
  asyncErrorHandler(getUserDetailsController)
);

module.exports = router;
