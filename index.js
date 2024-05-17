// index.js

const audit = require("express-requests-logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");

const { DB_URL, PORT } = require("./config");

const { cors } = require("./middlewares/cors");
const { excludeHTML } = require("./middlewares/static");
const { connectToDatabase } = require("./database/connect");
const { logger } = require("./logger");

const { apiRouter, pagesRouter } = require("./routes");

const app = express();

connectToDatabase(DB_URL);

app.use(
  audit({
    logger: logger,
    excludeURLs: ["ping"],
    levels: {
      "1xx": "info",
      "2xx": "info",
      "3xx": "info",
      401: "warn",
      403: "warn",
      "4xx": "info",
      503: "warn",
      "5xx": "error",
    },
  })
);
app.use(
  cors,
  cookieParser(),
  bodyParser.json(),
  excludeHTML,
  apiRouter,
  pagesRouter,
  express.static(path.join(path.resolve(), "./public"))
);

app.listen(PORT, () => {
  logger.info(`App is runnning on: http://localhost:${PORT}`);
});
