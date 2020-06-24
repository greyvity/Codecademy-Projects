const express = require("express");
const employeesRouter = express.Router();

// database import and instantiate
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const timesheetsRouter = require("./timeSheet");
employeesRouter.use("/:employeeId/timesheets", timesheetsRouter);

employeesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Employee WHERE Employee.is_current_employee = 1",
    (error, employees) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ employees: employees });
      }
    }
  );
});

employeesRouter.post("/", (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if (!name || !position || !wage) {
    res.sendStatus(400);
  } else {
    const sqlInsert =
      "INSERT INTO Employee(name, position, wage, is_current_employee)" +
      "VALUES ($name, $position, $wage, $isCurrentEmployee)";

    const values = {
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee,
    };

    db.run(sqlInsert, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
          (error, employee) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ employee: employee });
            }
          }
        );
      }
    });
  }
});

employeesRouter.param("employeeId", (req, res, next, employeeId) => {
  db.get(
    `SELECT * FROM Employee WHERE Employee.id = ${employeeId}`,
    (error, employee) => {
      if (error) {
        next(error);
      }
      if (!employee) {
        res.status(404).send();
      } else {
        req.employee = employee;
        next();
      }
    }
  );
});

employeesRouter.get("/:employeeId", (req, res, next) => {
  res.status(200).json({ employee: req.employee });
});

employeesRouter.put("/:employeeId", (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if (!name || !position || !wage) {
    res.sendStatus(400);
  } else {
    const sqlUpdate =
      "UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee " +
      "WHERE Employee.id = $employeeId";
    const values = {
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee,
      $employeeId: req.params.employeeId,
    };

    db.run(sqlUpdate, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
          (error, employee) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ employee: employee });
            }
          }
        );
      }
    });
  }
});

employeesRouter.delete("/:employeeId", (req, res, next) => {
  db.run(
    `UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = ${req.params.employeeId}`,
    function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
          (error, employee) => {
            res.status(200).json({ employee: employee });
          }
        );
      }
    }
  );
});

module.exports = employeesRouter;
