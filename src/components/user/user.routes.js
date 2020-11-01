const express = require("express");
const router = express.Router();

const {
  validateSignUp,
  validateLogin,
  validateEdit,
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
 * User Login
 * @name   post/login
 * @route  GET api/v1/user/login
 * @api    public
 * @desc   route for user to login
 * @param  {String} path user's signup path
 * @return {Object} `Auth Token` and User Instance
 */
router.post("/login", validateLogin(), catchErrors(userController.postLogin));

/**
 * Get All Users
 * @name   get/get-all
 * @route  POST api/v1/user/get-all
 * @api    private
 * @desc   route for user to load user profile
 * @param  {String} path user's signup path
 * @return {Object} User Instance
 */
router.get("/get-all", getAuthorize, catchErrors(userController.getAllUsers));

/**
 * Edit User
 * @name   put/edit/:userId
 * @route  PUT api/v1/user/edit/:userId
 * @api    private
 * @desc   route to edit user
 * @param  {String} path user's signup path
 * @return {Object} `User` instances
 */
router.post(
  "/edit/:userId",
  validateEdit(),
  getAuthorize,
  catchErrors(userController.postEditUser)
);

/**
 * Delete User
 * @name   delete/edit/:userId
 * @route  DELETE api/v1/user/remove/:userId
 * @api    private
 * @desc   route for user to delete their user
 * @param  {String} path user's user path
 */
router.delete(
  "/remove/:userId",
  getAuthorize,
  catchErrors(userController.deleteUser)
);

module.exports = router;
