const express = require("express");
const seriesRouter = express.Router();
const issuesRouter = require("./issues");

seriesRouter.use("/:seriesId/issues", issuesRouter);

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

seriesRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Series", (error, series) => {
    if (error) {
      next(error);
    }

    res.status(200).json({ series: series });
  });
});

seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(
    `SELECT * FROM Series WHERE Series.id = ${seriesId}`,
    (error, series) => {
      if (error) {
        next(error);
      } else if (series) {
        req.series = series;
        next();
      } else {
        res.status(404).send("INVALID");
      }
    }
  );
});

seriesRouter.get("/:seriesId", (req, res, next) => {
  res.status(200).json({ series: req.series });
});

seriesRouter.post("/", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  if (!name || !description) {
    res.sendStatus(400);
  }

  const sqlInsert =
    "INSERT INTO Series(name,description)" + "VALUES($name, $description)";

  const values = {
    $name: name,
    $description: description,
  };

  db.run(sqlInsert, values, function (error) {
    if (error) {
      next(error);
    }

    db.get(
      `SELECT * FROM Series WHERE Series.id = ${this.lastID}`,
      (error, series) => {
        if (error) {
          next(error);
        }

        res.status(201).json({ series: series });
      }
    );
  });
});

seriesRouter.put("/:seriesId", (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

  if (!name || !description) {
    res.sendStatus(400);
  } else {
    const sqlUpdate =
      "UPDATE Series SET name = $name, description = $description WHERE Series.id = $seriesId";
    const values = {
      $name: name,
      $description: description,
      $seriesId: req.params.seriesId,
    };

    db.run(sqlUpdate, values, (error) => {
      if (error) {
        next(error);
      }
      db.get(
        `SELECT * FROM Series WHERE Series.id=${req.params.seriesId}`,
        (error, series) => {
          if (error) {
            next(error);
          }
          res.status(200).json({ series: series });
        }
      );
    });
  }
});

seriesRouter.delete("/:seriesId", (req, res, next) => {
  const sql = "SELECT * FROM Issue WHERE Issue.series_id = $seriesId";
  const values = { $seriesId: req.params.seriesId };
  db.get(sql, values, (error, issue) => {
    if (error) {
      next(error);
    } else if (issue) {
      console.log("PENDING");
      res.sendStatus(400);
    } else {
      db.run(
        "DELETE FROM Series WHERE Series.id = $seriesId",
        values,
        function (error) {
          res.sendStatus(204);
        }
      );
    }
  });
});

module.exports = seriesRouter;
