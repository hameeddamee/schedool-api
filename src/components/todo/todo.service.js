const Todo = require("./todo.model");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createTodo = async (payload) => {
  const todo = await saveTodoWithPayload(payload);
  const todoSaved = await findAndPopulate(
    { _id: todo._id },
    null,
    "userId",
    "name email avatar"
  );

  return todoSaved;
};

exports.getAllTodosByUser = async (userId) => {
  const todos = await findAndPopulate(
    { userId },
    null,
    "userId",
    "name email avatar",
    "many"
  );
  // const todos = await findTodo({ userId }, null, "many");

  return todos;
};

exports.checkTodoOwnership = async (userId) => {
  const todo = await findTodo({ userId });

  if (isEmpty(todo)) {
    return false;
  }

  return true;
};

exports.editTodo = async (query, todoObj) => {
  await updateTodo(query, todoObj);

  const todo = await findAndPopulate(
    {
      ...query,
    },
    null,
    "userId",
    "name email avatar"
  );

  return todo;
};

exports.deleteTodo = async (query) => {
  const res = await deleteOneTodo(query);

  if (res.deletedCount === 0) {
    return false;
  }
  return true;
};

/**
 * Data Access Methods below here
 */

const findTodo = async (query = {}, selectQuery = "", findMode = "one") => {
  const todo = await Todo.find(query).select(selectQuery).exec();
  if (findMode === "one") {
    return todo[0];
  }
  return todo;
};

const saveTodoWithPayload = async (payload = {}) => {
  const todo = new Todo(payload);
  await todo.save();

  return todo;
};

const deleteOneTodo = async (query) => {
  const res = await Todo.deleteOne(query);
  return res;
};

const updateTodo = async (query, todoObj) => {
  await Todo.updateOne(query, todoObj);
  return true;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "",
  pathQuery = "",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const todo = await Todo.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return todo[0];
  }
  return todo;
};
