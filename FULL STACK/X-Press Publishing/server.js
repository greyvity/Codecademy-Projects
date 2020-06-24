const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler());
app.use(morgan("dev"));

PORT = process.argv[2] || process.env.PORT || 8081;

const apiRouter = require("./api/api");
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`server listening at ${PORT}`);
});

module.exports = app;
