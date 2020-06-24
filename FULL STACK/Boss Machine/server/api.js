const express = require("express");
const apiRouter = express.Router();

const minionsRouter = require("./Routes/minions");
apiRouter.use("/minions", minionsRouter);

const ideasRouter = require("./Routes/ideas");
apiRouter.use("/ideas", ideasRouter);

const meetingsRouter = require("./Routes/meetings");
apiRouter.use("/meetings", meetingsRouter);

module.exports = apiRouter;
