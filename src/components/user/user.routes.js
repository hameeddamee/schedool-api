const passport = require("passport");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  validateSignUp,
  validateLogin,
  validateForgotPassword,
  validateConfirmForgotPassword,
  validateOauthSignUp,
} = require("./user.validator");
const userController = require("./user.controller");

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");

// Unprotected User routes
/**
 * User Test
 * @name   get/
 * @route  GET api/v1/user/
 * @desc   Test user module
 * @api    public
 * @param  {String} / forward slash
 * @return {Object} Message
 */
router.get("/", (req, res) => {
  res.json({ msg: `User module working on ${process.env.APP_NAME}` });
});

/**
 * User Signup
 * @name   post/signup
 * @route  GET api/v1/user/sign-up
 * @desc   Local user signup flow
 * @api    public
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.post(
  "/sign-up",
  validateSignUp(),
  catchErrors(userController.postSignUp)
);

/**
 * User Signup
 * @name   post/signup
 * @route  GET api/v1/user/sign-up
 * @desc   Local user signup flow
 * @api    public
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.post(
  "/sign-up-oauth",
  validateOauthSignUp(),
  catchErrors(userController.postSignUpWithOAuth)
);

/**
 * User Facebook Callback
 * @name   post/authenticate
 * @route  GET api/v1/user/authenticate
 * @api    public
 * @desc   route for user to login
 * @param  {String} path user's signup path
 * @return {Object} `Auth Token` and User Instance
 */
router.post("/login", catchErrors(userController.postLogin));

/**
 * User Facebook Callback
 * @name   post/authenticate
 * @route  GET api/v1/user/authenticate
 * @api    public
 * @desc   route for user to login
 * @param  {String} path user's signup path
 * @return {Object} `Auth Token` and User Instance
 */
router.post("/login-oauth", catchErrors(userController.postLoginWithOAuth));
/**
 * User forgot password
 * @name   post/forgot-password
 * @route  POST api/v1/user/forgot-password
 * @api    public
 * @desc   route for user to get password reset
 * @param  {String} path user's signup path
 * @return {Object} Response object with empty content and success message
 */
router.post(
  "/forgot-password",
  validateForgotPassword(),
  catchErrors(userController.postForgotPassword)
);

/**
 * User verify reset password token
 * @name   get/confirm-reset-password
 * @route  GET api/v1/user/confirm-reset-password
 * @api    public
 * @desc   route to get confirm password reset is still valid
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get(
  "/verify-reset-password/:token",
  catchErrors(userController.getVerifyForgotPassword)
);

/**
 * User confirm reset password
 * @name   post/confirm-reset-password
 * @route  POST api/v1/user/confirm-reset-password
 * @api    public
 * @desc   route for user to get confirm their password reset
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.post(
  "/confirm-reset-password/:token",
  validateConfirmForgotPassword(),
  catchErrors(userController.postConfirmResetPassword)
);

/**
 * User confirm reset password
 * @name   get/get-user-current
 * @route  POST api/v1/user/get-user-current
 * @api    private
 * @desc   route for user to load user profile
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get(
  "/get-user-current",
  getAuthorize,
  catchErrors(userController.getCurrentUser)
);

/**
 * User Signup Confirmation
 * @name   get/confirm-sign-up
 * @route  GET api/v1/user/confirm-sign-up
 * @api    public
 * @desc   route for user to confirm signup
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get("/confirm-sign-up", catchErrors(userController.getConfirmSignUp));

/**
 * User Google Signup
 * @name   get/google
 * @route  GET api/v1/user/google
 * @api    public
 * @desc   launch Google signup flow
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * User Facebook Signup
 * @name   get/facebook
 * @route  GET api/v1/user/facebook
 * @api    public
 * @desc   launch Facebook signup flow
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

/**
 * User Google Callback
 * @name   get/google/callback
 * @route  GET api/v1/user/google/callback
 * @api    public
 * @desc   callback route for google to redirect to
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.get("/google/callback", catchErrors(userController.getGoogleCallback));

/**
 * User Facebook Callback
 * @name   get/facebook/callback
 * @route  GET api/v1/user/facebook/callback
 * @api    public
 * @desc   callback route for facebook to redirect to
 * @param  {String} path user's signup path
 * @return {Users} `User` instance
 */
router.get(
  "/facebook/callback",
  catchErrors(userController.getFacebookCallback)
);

module.exports = router;
