const { clearHash } = require("../helpers/cacheHelpers");

module.exports = async (req, res, next) => {
  await next();

  clearHash(req.user.id);
};
