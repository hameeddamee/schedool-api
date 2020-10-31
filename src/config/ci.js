const dotenv = require("dotenv");

const envFound = dotenv.config({ path: "variables.env" });
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  appName: process.env.APP_NAME,
  port: parseInt(process.env.PORT, 10),
  dbURI: "mongodb://127.0.0.1:27017/joynt_ci",
  jwtSecret: process.env.JWT_SECRET,
  tokenType: process.env.JWT_TOKEN_TYPE,
  redisUrl: "redis://127.0.0.1:6379",
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  api: {
    prefix: process.env.API_PREFIX,
  },
  emails: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};
