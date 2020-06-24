const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(errorHandler());
app.use(cors());

const apiRouter = require("./apis/api");
app.use("/api", apiRouter);

const PORT = process.argv[2] || process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening in port ${PORT}`));

module.exports = app;
