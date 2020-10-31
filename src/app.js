const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const handler = require("./library/helpers/errorHandlers");
const config = require("./config");
const { userModule, todoModule } = require("./components");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.set("trust proxy", 1);

app.use(`${config.api.prefix}/user`, userModule.routes);
app.use(`${config.api.prefix}/todo`, todoModule.routes);

handler.handleErrors(app);

module.exports = app;
