const { check } = require("express-validator");
const { passwordPattern } = require("../../library/helpers/validationHelpers");

const message = {
  name: "Your name must be only letters with min of 5 and a max 20 characters",
  email: "Please enter a valid email",
  password:
    "Your password must include uppercase, numbers, letters and a minimum  of 5 characters",
  confirmPassword: "Passwords have to match",
};

exports.validateSignUp = () => {
  return [
    check("name", message.name).isAlpha().isLength({ min: 5, max: 20 }).trim(),
    check("email").isEmail().withMessage(message.email).trim().normalizeEmail(),
    check("password", message.password)
      .isLength({ min: 5 })
      .matches(passwordPattern)
      .trim(),
  ];
};

exports.validateOauthSignUp = () => {
  return [
    check("firstName", message.name)
      .isAlpha()
      .isLength({ min: 2, max: 20 })
      .trim(),
    check("lastName", message.name)
      .isAlpha()
      .isLength({ min: 2, max: 20 })
      .trim(),
    check("email").isEmail().withMessage(message.email).trim().normalizeEmail(),
  ];
};

exports.validateLogin = () => {
  return [
    check("email").isEmail().withMessage(message.email).trim().normalizeEmail(),
    check("password", message.password)
      .isLength({ min: 5 })
      .matches(passwordPattern)
      .trim(),
  ];
};

exports.validateForgotPassword = () => {
  return [
    check("email").isEmail().withMessage(message.email).trim().normalizeEmail(),
  ];
};

exports.validateConfirmForgotPassword = () => {
  return [
    check("password", message.password)
      .isLength({ min: 5 })
      .matches(passwordPattern)
      .trim(),
  ];
};
