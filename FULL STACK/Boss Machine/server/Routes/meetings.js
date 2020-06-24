const express = require("express");
const meetingsRouter = express.Router();

const {
  createMeeting,
  getAllFromDatabase,
  addToDatabase,
  deleteAllFromDatabase,
} = require("../db");

meetingsRouter.get("/", (req, res, next) => {
  const meetings = getAllFromDatabase("meetings");
  if (meetings) {
    res.status(200).send(meetings);
  } else {
    res.status(404).send("Not found");
  }
});
meetingsRouter.post("/", (req, res, next) => {
  const newMeeting = createMeeting();
  res.send(addToDatabase("meetings", newMeeting));
});

meetingsRouter.delete("/:meetingId", (req, res, next) => {
  if (deleteAllFromDatabase("meetings", req.params.meetingId) === true) {
    res.status(204).send();
  }
  res.send("No content");
});

module.exports = meetingsRouter;
