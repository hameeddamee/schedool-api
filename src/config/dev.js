const dotenv = require("dotenv");

const envFound = dotenv.config({ path: ".env" });
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  appName: "joynt-meet-dev",
  port: 4000,
  dbURI: "mongodb://localhost:27017/joynt-dev",
  jwtSecret: "3p48-94i1u08qfhdj489135u0t9324i=2r02jf449u130",
  tokenType: "Bearer",
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
