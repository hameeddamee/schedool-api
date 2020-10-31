const express = require("express");
const router = express.Router();

const todoController = require("./todo.controller");

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");

// Unprotected todo routes
/**
 * todo Signup
 * @name   get/
 * @route  GET api/v1/todo/
 * @desc   Test todo module
 * @api    public
 * @param  {String} / forward slash
 * @return {Object} Message
 */
router.get("/", (req, res) => {
  res.json({ msg: `Todo module working on ${process.env.APP_NAME}` });
});

/**
 * Create todo
 * @name   post/create-todo
 * @route  POST api/v1/todo/create
 * @desc   Create todo
 * @api    public
 * @param  {String} path todo's creation path
 * @return {todos} `todo` instance
 */
router.post(
  "/create",
  getAuthorize,
  catchErrors(todoController.postCreatetodo)
);

/**
 * Invite to todo
 * @name   post/invite
 * @route  POST api/v1/todo/invite/:linkId
 * @desc   Invite users to todo
 * @api    public
 * @param  {String} path todo's  invite path
 * @return {todos} `todo` instance
 */
router.post(
  "/invite/:linkId",
  getAuthorize,
  catchErrors(todoController.postInviteTotodo)
);

/**
 * Join a todo
 * @name   post/join
 * @route  POST api/v1/todo/join/:linkId
 * @desc   Join a todo
 * @api    public
 * @param  {String} path todo's creation path
 * @return {todos} `todo` instance
 */
router.post(
  "/invite/:linkId",
  getAuthorize,
  catchErrors(todoController.postJointodo)
);

module.exports = router;
