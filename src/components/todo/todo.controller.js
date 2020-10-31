const todoService = require("./todo.service");
const userService = require("../user/user.service");
const todoError = require("./todo.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { encode } = require("../../library/helpers/jwtHelpers");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");
const config = require("../../config");
const socketIO = require("../../socket");

exports.postCreatetodo = async (req, res) => {
  const authorizedUser = req.currentUser;
  const todo = await todoService.createtodo(authorizedUser);

  await userService.addtodo(authorizedUser._id, todo);

  return res.status(200).send(
    sendResponse({
      message: "todo created successfully",
      content: todo,
      success: true,
    })
  );
};

exports.postInviteTotodo = async (req, res) => {
  const authorizedUser = req.currentUser;
  const todoLinkId = req.params.linkId;
  const guestList = req.body.guestEmails;

  if (isEmpty(guestList)) {
    throw todoError.NotAllowed("You cannot invite with an empty email");
  }

  const todoOwnershipCheck = await todoService.checktodoOwnership(
    authorizedUser._id,
    todoLinkId
  );

  if (todoOwnershipCheck === false) {
    throw todoError.NotAllowed("You are not permitted to invite to this todo");
  }

  const updatetodo = await todoService.addGuestsTotodo(todoLinkId, guestList);

  return res.status(200).send(
    sendResponse({
      message: "User invite sent successfully",
      content: updatetodo,
      success: true,
    })
  );
};

exports.postJointodo = async (req, res) => {
  const authorizedUser = req.currentUser;
  const todoLinkId = req.params.linkId;

  const todoGuestCheck = await todoService.checktodoGuest(
    authorizedUser.email,
    todoLinkId
  );

  if (todoGuestCheck === false) {
    throw todoError.NotAllowed(
      "You are not on a guest list to join this todo."
    );
  }

  // do some SocketIO stuffs
  const socket = socketIO.getSocket();
  socket.on("join-todo", (todoId, userId) => {
    socket.join(todoId);
    socket.to(todoId).broadcast.emit("user-connected", userId);
    // messages
    socket.on("message", (message) => {
      //send message to the same todo
      io.to(todoId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(todoId).broadcast.emit("user-disconnected", userId);
    });
  });

  return res.status(200).send(
    sendResponse({
      message: "User joined todo successfully",
      content: {},
      success: true,
    })
  );
};
