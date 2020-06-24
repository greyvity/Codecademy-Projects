const express = require("express");
const minionsRouter = express.Router();
const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase,
} = require("../db");

minionsRouter.get("/", (req, res, next) => {
  const minions = getAllFromDatabase("minions");
  if (minions) {
    res.status(200).send(minions);
  } else {
    res.status(404).send("Not found");
  }
});

minionsRouter.get("/:minionId", (req, res, next) => {
  const minion = getFromDatabaseById("minions", req.params.minionId);
  if (minion) {
    res.status(200).send(minion);
  } else {
    res.status(404).send("Not found");
  }
});

minionsRouter.post("/", (req, res, next) => {
  if (
    req.body.name &&
    req.body.title &&
    req.body.weaknesses &&
    req.body.salary
  ) {
    res.send(addToDatabase("minions", req.body));
  }
  res.status(404).send("insufficient information");
});

minionsRouter.put("/:minionId", (req, res, next) => {
  req.body.id = req.params.minionId;
  res.send(updateInstanceInDatabase("minions", req.body));
});

minionsRouter.delete("/:minionId", (req, res, next) => {
  res.send(deleteFromDatabasebyId("minions", req.params.minionId));
});

module.exports = minionsRouter;
