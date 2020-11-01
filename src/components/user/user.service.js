const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const User = require("./user.model");
const userError = require("./user.error");

const config = require("../../config");
const cleanCache = require("../../library/middlewares/cleanCache");

const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const { randomPassword } = require("../../library/helpers/stringHelpers");
const mailHelpers = require("../../library/helpers/mailHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

const findUser = async (query = {}, selectQuery = "", findMode = "one") => {
  const user = await User.find(query).select(selectQuery).exec();
  if (findMode === "one") {
    return user[0];
  }
  return user;
};

exports.checkUserExist = async (query) => {
  const user = await findUser({ ...query });

  if (!user) {
    return false;
  }

  return true;
};

exports.signUp = async ({ formattedfullNames, email, password }) => {
  let avatar = await gravatar.url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm", // Default
  });

  // Save the user
  let userObj = {
    name: formattedfullNames,
    email,
    avatar: avatar,
    enable: true,
    password,
  };

  const user = new User(userObj);
  await user.save();

  let token = jwtHelpers.encode({ email });
  logger.info(`Auth token created: ${token}`);

  return {
    token: `${config.tokenType} ${token}`,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    enable: user.enable,
  };
};

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email }).populate("todos");

  if (!user) {
    logger.warn("Authentication failed. Wrong credential.");
    throw userError.WrongCredential();
  }
  if (!user.enable) {
    logger.warn("User account not activated");
    throw userError.Unactivated();
  }
  const isValidPassword = await bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    logger.warn("Authentication failed. Wrong credential.");
    throw userError.WrongCredential();
  }

  let token = jwtHelpers.encode({ email });
  logger.info(`Auth token created: ${token}`);

  return {
    token: `${config.tokenType} ${token}`,
    user: {
      name: user.name,
      avatar: user.avatar,
      enable: user.enable,
      email: user.email,
      todos: user.todos,
    },
  };
};

exports.findAllUsers = async () => {
  const selectQuery = {
    password: 0,
    resetPasswordExpires: 0,
    resetPasswordToken: 0,
  };
  const users = await findUser({}, selectQuery, "many");

  return users;
};

exports.editUser = async (query, userObj) => {
  await updateUser(query, userObj);
  const selectQuery = {
    password: 0,
    resetPasswordExpires: 0,
    resetPasswordToken: 0,
  };

  const user = await findAndPopulate(
    {
      ...query,
    },
    selectQuery,
    "posts"
  );

  return user;
};

exports.deleteUser = async (query) => {
  const res = await deleteOneUser(query);

  if (res.deletedCount === 0) {
    return false;
  }
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
  const user = await User.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return user[0];
  }
  return user;
};

const updateUser = async (query, userObj) => {
  await User.updateOne(query, userObj);
  return true;
};

const deleteOneUser = async (query) => {
  const res = await User.deleteOne(query);
  return res;
};

exports.addTodo = async (todo) => {
  const user = await findUser({ _id: todo.userId });

  if (isEmpty(user)) {
    logger.warn("User not found.");
    throw userError.UserNotFound();
  }

  user.todos.push(todo);
  await user.save();

  return true;
};

/**
|--------------------------------------------------
| DELETE EVERYTHING BELOW THIS LINE WHEN DONE
|--------------------------------------------------
*/

exports.confirmSignUp = async (email) => {
  const selectQuery = "fullName avatar enable email";
  let user = await findUser({ email }, selectQuery);

  if (user.enable === true) {
    throw userError.UserAlreadyConfirmed();
  }

  user.enable = true;
  await User.updateOne({ email }, user);

  return user;
};

exports.findUserByOauthId = async (
  id,
  selectQuery = "fullName avatar enable email"
) => {
  const user = await findUser({ oauthId: id }, selectQuery);

  return user;
};

exports.forgotPassword = async (email, host) => {
  const user = await findUser({ email });

  if (!user) {
    throw userError.UserNotFound();
  }

  // Generate new password for mobile app purpose
  let password = randomPassword();
  logger.info(`Password was generated: ${password}`);
  user.resetPassword = password;
  user.resetPasswordToken = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "1h",
  });
  user.resetPasswordExpires = Date.now() + 3600000;

  await User.updateOne({ email }, user);
  const resetURL = `${host}/auth/reset-password/${user.resetPasswordToken}`;
  await mailHelpers.send({
    user,
    filename: "password-reset",
    subject: "Password Reset",
    resetURL,
    resetPassword: password,
  });

  return user;
};

exports.verifyForgotPassword = async ({ token }) => {
  const user = await findUser({
    $or: [
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      {
        resetPassword: token,
      },
    ],
  });

  if (!user) {
    throw userError.PasswordReset();
  }

  return user;
};

exports.confirmResetPassword = async ({ token, password }) => {
  const user = await findUser({
    $or: [
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
      {
        resetPassword: token,
      },
    ],
  });

  if (!user) {
    throw userError.PasswordReset();
  }

  const hash = await bcrypt.hashSync(password);

  await User.updateOne(
    { email: user.email },
    {
      password: hash,
      resetPassword: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }
  );

  const selectQuery = "fullName avatar enable email resetPassword";
  const updatedUser = await findUser({ email: user.email }, selectQuery);

  return updatedUser;
};

exports.findUserByEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw userError.UserNotFound("Authentication failed. User not found.");
  }

  return user;
};

exports.findUserById = async (id) => {
  const user = await findUser({ _id: id });

  if (!user) {
    logger.warn("User not found.");
    throw userError.UserNotFound();
  }

  return user;
};
