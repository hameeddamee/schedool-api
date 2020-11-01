const express = require("express");
const router = express.Router();

const todoController = require("./todo.controller");
const { validateTodo } = require("./todo.validator");

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");

// Unprotected todo routes
/**
 * Todo Test
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
  validateTodo(),
  catchErrors(todoController.postCreateTodo)
);

/**
 * Get All Todos by a user
 * @name   get/all
 * @route  POST api/v1/todo/all
 * @api    private
 * @desc   route for user to load todo
 * @return {Object} Todo Instances
 */
router.get("/all", getAuthorize, catchErrors(todoController.getAllTodos));

/**
 * Edit Todo
 * @name   put/edit/:todoId
 * @route  PUT api/v1/todo/edit/:todoId
 * @api    private
 * @desc   route to edit todo
 * @param  {String} path todo's edit path
 * @return {Object} `Todo` instances
 */
router.post(
  "/edit/:todoId",
  getAuthorize,
  validateTodo(),
  catchErrors(todoController.postEditTodo)
);

/**
 * Delete Todo
 * @name   delete/edit/:todoId
 * @route  DELETE api/v1/todo/remove/:todoId
 * @api    private
 * @desc   route users to delete their todos
 * @param  {String} path todo's delete path
 */
router.delete(
  "/remove/:todoId",
  getAuthorize,
  catchErrors(todoController.deleteTodo)
);

module.exports = router;
