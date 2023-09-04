const { findUserByEmail, createUser } = require("../store/userStore");
const CustomError = require("../utils/customError");
const { getURLQueryStringFromObj } = require("../utils/url");
const {
  createAccessToken,
  createRefreshToken,
  createSocketToken,
} = require("../utils/createTokens");
const { validateUser } = require("../models/user.model");

const getGoogleOAuthURL = () => {
  const options = {
    redirect_uri: `${process.env.CLIENT_ROOT_URL}/google-callback`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${process.env.GOOGLE_OAUTH_ROOT_URL}?${getURLQueryStringFromObj(
    options
  )}`;
};

const getGoogleAccessToken = async (code) => {
  // get access token from google api using code
  const getAccessTokenRes = await fetch(process.env.GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.CLIENT_ROOT_URL}/google-callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!getAccessTokenRes.ok) {
    throw new CustomError(
      getAccessTokenRes.status,
      getAccessTokenRes.statusText
    );
  }

  const jsonText = await getAccessTokenRes.text();
  const { access_token } = JSON.parse(jsonText);

  // get userinfo from google api using access-token
  const fetchUserInfoRes = await fetch(
    `${process.env.GOOGLE_USER_INFO_URL}?alt=json&access_token=${access_token}`
  );

  if (!fetchUserInfoRes.ok) {
    throw new CustomError(fetchUserInfoRes.status, fetchUserInfoRes.statusText);
  }

  const userInfo = await fetchUserInfoRes.json();

  // check user exist in database
  const userData = await findUserByEmail(userInfo.email);
  let dbUserData;

  // if not exist validate data and create user
  if (!userData) {
    const dataToInsert = {
      userName: userInfo.name,
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      pictureURL: userInfo.picture,
    };

    const { error, value } = validateUser(dataToInsert);

    if (error) {
      throw new CustomError(500, "Failed to add user, please try again...");
    }

    dbUserData = await createUser(dataToInsert);
  } else {
    dbUserData = userData;
  }

  // create access, refresh and socket tokens
  const accessToken = createAccessToken({
    id: dbUserData._id,
    email: dbUserData.email,
  });

  const refreshToken = createRefreshToken({
    id: dbUserData._id,
    email: dbUserData.email,
  });

  const socketToken = createSocketToken({
    id: dbUserData._id,
    email: dbUserData.email,
  });

  return {
    accessToken,
    refreshToken,
    socketToken,
  };
};

const getDemoUserToken = async () => {
  const demoUserDetails = await findUserByEmail(process.env.DEMO_USER_MAIL);

  if (!demoUserDetails) return null;

  // create access, refresh and socket tokens
  const accessToken = createAccessToken({
    id: demoUserDetails._id,
    email: demoUserDetails.email,
  });

  const refreshToken = createRefreshToken({
    id: demoUserDetails._id,
    email: demoUserDetails.email,
  });

  const socketToken = createSocketToken({
    id: demoUserDetails._id,
    email: demoUserDetails.email,
  });

  return {
    accessToken,
    refreshToken,
    socketToken,
  };
};

const getNewAccessToken = (payload) => {
  return createAccessToken(payload);
};

module.exports = {
  getGoogleOAuthURL,
  getGoogleAccessToken,
  getNewAccessToken,
  getDemoUserToken,
};
