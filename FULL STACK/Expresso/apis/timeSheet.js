const express = require("express");
const timesheetsRouter = express.Router({ mergeParams: true });

// database import and instantiate
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

timesheetsRouter.get("/", (req, res, next) => {
  db.all(
    `SELECT * FROM Timesheet WHERE Timesheet.employee_id = ${req.params.employeeId}`,
    (error, timesheets) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ timesheets: timesheets });
      }
    }
  );
});

timesheetsRouter.post("/", (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.params.employeeId;

  if (!hours || !rate || !date) {
    res.status(400).send();
  } else {
    const sqlInsert =
      "INSERT INTO Timesheet(hours, rate, date, employee_id) " +
      "VALUES ($hours, $rate, $date, $employeeId)";
    const values = {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employeeId: employeeId,
    };

    db.run(sqlInsert, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
          (error, timesheet) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ timesheet: timesheet });
            }
          }
        );
      }
    });
  }
});

timesheetsRouter.param("timesheetId", (req, res, next, timesheetId) => {
  db.get(
    `SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
    (error, timesheet) => {
      if (error) {
        next(error);
      } else if (timesheet) {
        req.timesheet = timesheet;
        next();
      } else {
        res.status(404).send();
      }
    }
  );
});

timesheetsRouter.put("/:timesheetId", (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.params.employeeId;

  if (!hours || !rate || !date) {
    res.status(400).send();
  } else {
    const sqlUpdate =
      "UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date WHERE Timesheet.id = $timesheetId";
    const values = {
      $hours: hours,
      $rate: rate,
      $date: date,
      $timesheetId: req.params.timesheetId,
    };

    db.run(sqlUpdate, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
          (error, timesheet) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ timesheet: timesheet });
            }
          }
        );
      }
    });
  }
});

timesheetsRouter.delete("/:timesheetId", (req, res, next) => {
  db.run(
    `DELETE FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
    function (error) {
      if (error) {
        next(error);
      } else {
        res.status(204).json({ timesheet: req.timesheet });
      }
    }
  );
});

module.exports = timesheetsRouter;
