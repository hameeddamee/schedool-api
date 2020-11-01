const { check } = require("express-validator");

const message = {
  name: "todo name must be only letters with min of 5",
};

exports.validateTodo = () => {
  return [
    check("title", message.name).isString().isLength({ min: 1 }).trim(),
    check("description").isString(),
    check("state").isString(),
    check("priority").isString(),
  ];
};
