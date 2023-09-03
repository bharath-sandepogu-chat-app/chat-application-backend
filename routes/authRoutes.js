const express = require("express");
const router = express.Router();

//controllers
const {
  getGoogleAuthController,
  getGoogleAccessTokenController,
  getNewAccessTokenController,
} = require("../controller/authController");

// utils and middleWares
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { verifyRefreshToken } = require("../middleware/verifyToken");

router.get("/google/url", getGoogleAuthController);
router.get("/google/login", asyncErrorHandler(getGoogleAccessTokenController));
router.post("/renew-token", verifyRefreshToken, getNewAccessTokenController);

module.exports = router;
