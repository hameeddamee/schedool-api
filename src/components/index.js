const userRoutes = require("./user/user.routes");
const userModel = require("./user/user.model");
const userService = require("./user/user.service");

const todoRoutes = require("./todo/todo.routes");
const todoModel = require("./todo/todo.model");
const todoService = require("./todo/todo.service");

const componentModule = {
  userModule: {
    routes: userRoutes,
    model: userModel,
    service: userService,
  },
  todoModule: {
    routes: todoRoutes,
    model: todoModel,
    service: todoService,
  },
};

module.exports = componentModule;
