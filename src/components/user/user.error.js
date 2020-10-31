const {
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("http-status-codes");
const { AppError } = require("../../library/helpers/errorFormatHelpers");

module.exports = {
  InvalidInput: (
    content = {},
    message = "Invalid form inputs",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  UserExist: (
    content = {},
    message = "User already exist",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  UserNotFound: (
    content = {},
    message = "User not found.",
    name = null,
    innerException = null
  ) => new AppError(name, NOT_FOUND, message, content, innerException),
  UserWrongMethod: (
    content = {},
    message = "This account was registered using a third party platform. Please use the appropriate login method",
    name = null,
    innerException = null
  ) => new AppError(name, NOT_FOUND, message, content, innerException),
  UserAlreadyConfirmed: (
    content = {},
    message = "User already confirmed",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
  Unactivated: (
    content = {},
    message = "User account not activated",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
  Oauth: (
    content = {},
    message = message,
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
  WrongPassword: (
    content = {},
    message = "Wrong password.",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
  PasswordReset: (
    content = {},
    message = "Password reset is invalid or has expired",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
  TokenNotFound: (
    content = {},
    message = "Token Not Found",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),
};
