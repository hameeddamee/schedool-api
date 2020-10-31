const passport = require("passport");
const { validationResult } = require("express-validator");

const userService = require("./user.service");
const userError = require("./user.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { sentenceCase } = require("../../library/helpers/stringHelpers");
const { encode } = require("../../library/helpers/jwtHelpers");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");
const config = require("../../config");

exports.postSignUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }

  const { firstName, lastName, email, password } = req.body;
  let formattedFirstName = sentenceCase(firstName);
  let formattedLastName = sentenceCase(lastName);
  let formattedfullNames = sentenceCase(`${firstName} ${lastName}`);

  const userExist = await userService.checkUserExist(email);

  if (userExist) {
    throw userError.UserExist();
  }

  const user = await userService.signUp({
    formattedFirstName,
    formattedLastName,
    formattedfullNames,
    email,
    password,
  });

  return res.status(200).send(
    sendResponse({
      message: "User account created successfully",
      content: user,
      success: true,
    })
  );
};

exports.postSignUpWithOAuth = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    oauthType,
    oauthId,
    oauthAvatar,
  } = req.body;
  let formattedFirstName = sentenceCase(firstName);
  let formattedLastName = sentenceCase(lastName);
  let formattedfullNames = sentenceCase(`${firstName} ${lastName}`);

  const userExist = await userService.checkUserExist(email);

  if (userExist) {
    throw userError.UserExist();
  }

  if (isEmpty(oauthType) || isEmpty(oauthId)) {
    throw userError.InvalidInput();
  }

  const user = await userService.signUp({
    formattedFirstName,
    formattedLastName,
    formattedfullNames,
    email,
    oauthAvatar,
    oauthType,
    oauthId,
  });

  return res.status(200).send(
    sendResponse({
      message: "User account created successfully",
      content: user,
      success: true,
    })
  );
};

exports.getGoogleCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    (err, passportRes, info) => {
      if (err) {
        return userError.Oauth({}, err.message);
      }

      const user = passportRes;
      const token = encode(user.email);
      const data = { token, user };
      return res.status(200).send(
        sendResponse({
          message: "User successfully authenticated",
          content: data,
          success: true,
        })
      );
    }
  )(req, res, next);
};

exports.getFacebookCallback = async (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false },
    (err, passportRes, info) => {
      if (err) {
        return userError.Oauth({}, err.message);
      }

      const user = passportRes;
      const token = encode(user.email);
      const data = { token, user };
      return res.status(200).send(
        sendResponse({
          message: "User successfully authenticated",
          content: data,
          success: true,
        })
      );
    }
  )(req, res, next);
};

exports.getConfirmSignUp = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    throw userError.TokenNotFound();
  }

  let decoded = await jwtHelpers.decode(token, config.jwtSecret);
  let email = decoded.payload.email;
  const user = await userService.confirmSignUp(email);

  return res.status(200).send(
    sendResponse({
      message: "User's signup successfully activated",
      content: user,
      success: true,
    })
  );
};

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }

  const { email, password } = req.body;
  const user = await userService.authenticate(email.toLowerCase(), password);

  return res.status(200).send(
    sendResponse({
      message: "User successfully logged in",
      content: user,
      success: true,
    })
  );
};

exports.postLoginWithOAuth = async (req, res) => {
  const { email } = req.body;

  const user = await userService.authenticate(email);

  return res.status(200).send(
    sendResponse({
      message: "User account created successfully",
      content: user,
      success: true,
    })
  );
};

exports.postForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  const frontEndUrl = config.clientBaseUrl;

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }
  const { email } = req.body;

  const user = await userService.forgotPassword(email, frontEndUrl);

  return res.status(200).send(
    sendResponse({
      message: "You have been emailed a password reset link.",
      content: {},
      success: true,
    })
  );
};

exports.getVerifyForgotPassword = async (req, res) => {
  const { token } = req.params;

  const user = await userService.verifyForgotPassword({
    token,
  });

  return res.status(200).send(
    sendResponse({
      message: "Token valid",
      content: { email: user.email },
      success: true,
    })
  );
};

exports.postConfirmResetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }

  const { token } = req.params;
  const { password } = req.body;

  const user = await userService.confirmResetPassword({
    token,
    password,
  });

  return res.status(200).send(
    sendResponse({
      message: `Your password is: ${user.resetPassword}`,
      content: user,
      success: true,
    })
  );
};

exports.getCurrentUser = async (req, res) => {
  const email = req.decoded.payload.email;
  const user = await userService.findCurrentUser(email);

  if (!user) {
    logger.warn("No User found.");
    return userError.UserNotFound();
  }

  return res.status(200).send(
    sendResponse({
      message: "Current user successfully loaded",
      content: user,
      success: true,
    })
  );
};
