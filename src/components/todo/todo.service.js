const todo = require("./todo.model");
const todoError = require("./todo.error");

const config = require("../../config");

const cleanCache = require("../../library/middlewares/cleanCache");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const mailHelpers = require("../../library/helpers/mailHelpers");
const stringHelpers = require("../../library/helpers/stringHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createtodo = async ({ _id }) => {
  let linkId = stringHelpers.genCryptoRandomId();

  const todo = await savetodoWithPayload({
    linkId,
    host: _id,
  });

  const todoSaved = await findAndPopulate(
    { linkId, _id: todo._id },
    "host",
    "firstName lastName fullName email"
  );

  return todoSaved;
};

exports.checktodoOwnership = async (hostId, todoLinkId) => {
  const todo = await findtodo({ host: hostId, linkId: todoLinkId });

  if (isEmpty(todo)) {
    return false;
  }

  return true;
};

exports.checktodoGuest = async (guestEmail, todoLinkId) => {
  const todo = await findtodo({ guests: guestEmail, linkId: todoLinkId });

  if (isEmpty(todo)) {
    return false;
  }

  return true;
};

exports.addGuestsTotodo = async (todoLinkId, guestList) => {
  const todo = await findtodo({ linkId: todoLinkId });

  if (isEmpty(todo)) {
    throw todoError.NotAllowed();
  }

  for (const guest of guestList) {
    const guestFound = todo.guests.filter(
      (guestExisting) => guest === guestExisting
    );

    if (isEmpty(guestFound)) {
      todo.guests.push(guest);
    }
  }

  await savetodo(todo);

  const updatetodo = await findAndPopulate(
    { linkId: todoLinkId },
    "host",
    "firstName lastName fullName email"
  );

  return updatetodo;
};

/**
 * Data Access Methods below here
 */

const findtodo = async (query = {}, selectQuery = "", findMode = "one") => {
  const todo = await todo.find(query).select(selectQuery).exec();
  if (findMode === "one") {
    return todo[0];
  }
  return todo;
};

const savetodoWithPayload = async (payload = {}) => {
  const todo = new todo(payload);
  await todo.save();

  return todo;
};

const savetodo = async (todo) => {
  await todo.save();

  return todo;
};

const findAndPopulate = async (
  query = {},
  path = "",
  selectQuery = "",
  findMode = "one"
) => {
  const todo = await todo.find(query).populate({
    path: path,
    select: selectQuery,
  });

  if (findMode === "one") {
    return todo[0];
  }
  return todo;
};
