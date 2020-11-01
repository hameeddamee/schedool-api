const { validationResult } = require("express-validator");

const todoService = require("./todo.service");
const userService = require("../user/user.service");
const todoError = require("./todo.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.postCreateTodo = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw todoError.InvalidInput(errors.mapped());
  }

  const authorizedUser = req.currentUser;
  const todoData = req.body;
  todoData.userId = authorizedUser._id;
  const savedTodo = await todoService.createTodo(todoData);

  await userService.addTodo(savedTodo);

  return res.status(200).send(
    sendResponse({
      message: "todo created successfully",
      content: savedTodo,
      success: true,
    })
  );
};

exports.getAllTodos = async (req, res) => {
  const authorizedUser = req.currentUser;
  const todos = await todoService.getAllTodosByUser(authorizedUser._id);

  return res.status(200).send(
    sendResponse({
      message: "Current user successfully loaded",
      content: todos,
      success: true,
    })
  );
};

exports.postEditTodo = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw todoError.InvalidInput(errors.mapped());
  }

  let updateData = req.body;
  const authorizedUser = req.currentUser;
  const { todoId } = req.params;

  const isValidOwner = await todoService.checkTodoOwnership(authorizedUser._id);

  if (!isValidOwner) {
    throw todoError.NotAllowed("You cannot perform this action");
  }

  if (isEmpty(todoId)) {
    throw todoError.NotFound("Please specify a todo to edit");
  }

  const query = { _id: todoId };
  const update = { $set: updateData };
  let editedTodo = await todoService.editTodo(query, update);

  return res.status(200).send(
    sendResponse({
      message: "Todo updated",
      content: editedTodo,
      success: true,
    })
  );
};

exports.deleteTodo = async (req, res) => {
  let authorizedUser = req.currentUser;
  let { todoId } = req.params;

  if (isEmpty(todoId)) {
    throw todoError.NotFound("Please specify a todo to delete");
  }

  const query = { _id: todoId };
  const isDeleted = await todoService.deleteTodo(query);

  if (!isDeleted) {
    throw todoError.ActionFailed("Unable to delete todo");
  }

  const allTodos = await todoService.getAllTodosByUser(authorizedUser._id);

  return res.status(200).send(
    sendResponse({
      message: "User deleted",
      content: allTodos,
      success: true,
    })
  );
};
