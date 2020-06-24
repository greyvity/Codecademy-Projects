const express = require("express");
const ideasRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase,
} = require("../db");

ideasRouter.get("/", (req, res, next) => {
  res.send(getAllFromDatabase("ideas"));
});

ideasRouter.get("/:ideaId", (req, res, next) => {
  res.send(getFromDatabaseById("ideas", req.params.ideaId));
});

ideasRouter.post("/", (req, res, next) => {
  if (
    req.body.name &&
    req.body.description &&
    req.body.weeklyRevenue &&
    req.body.numWeeks
  ) {
    res.send(addToDatabase("ideas", req.body));
  }
  res.status(404).send("insufficient information");
});

ideasRouter.put("/:ideaId", (req, res, next) => {
  req.body.id = req.params.ideaId;
  res.send(updateInstanceInDatabase("ideas", req.body));
});

ideasRouter.delete("/:ideaId", (req, res, next) => {
  res.send(deleteFromDatabasebyId("ideas", req.params.ideaId));
});

module.exports = ideasRouter;
