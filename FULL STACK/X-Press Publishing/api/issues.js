const express = require("express");
const issuesRouter = express.Router({ mergeParams: true });

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

issuesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Issue WHERE Issue.series_id = $seriesId",
    { $seriesId: req.params.seriesId },
    (error, issues) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ issues: issues });
      }
    }
  );
});

issuesRouter.post("/", (req, res, next) => {
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issueNumber;
  const publicationDate = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;
  if (!name || !issueNumber || !publicationDate || !artistId) {
    res.status(400).send();
  } else {
    const sqlInsert =
      "INSERT INTO Issue(name, issue_number, publication_date, series_id, artist_id)" +
      "VALUES ($name, $issueNumber, $publicationDate, $seriesId, $artistId)";
    const values = {
      $name: name,
      $issueNumber: issueNumber,
      $publicationDate: publicationDate,
      $artistId: artistId,
      $seriesId: req.params.seriesId,
    };

    db.get(
      `SELECT * FROM Artist WHERE Artist.id = ${artistId}`,
      (error, artist) => {
        if (error) {
          next(error);
        } else if (!artist) {
          res.sendStatus(400);
        } else {
          db.run(sqlInsert, values, function (error) {
            if (error) {
              next(error);
            }
            db.get(
              `SELECT * FROM Issue WHERE Issue.id = ${this.lastID}`,
              (error, issue) => {
                if (error) {
                  next(error);
                } else {
                  res.status(201).json({ issue: issue });
                }
              }
            );
          });
        }
      }
    );
  }
});

issuesRouter.param("issueId", (req, res, next, issueId) => {
  const sql = "SELECT * FROM Issue WHERE Issue.id=$issueId";
  const values = { $issueId: issueId };

  db.get(sql, values, (error, issue) => {
    if (error) {
      next(error);
    } else if (issue) {
      req.issue = issue;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

issuesRouter.put("/:issueId", (req, res, next) => {
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issueNumber;
  const publicationDate = req.body.issue.publicationDate;
  const artistId = req.body.issue.artistId;
  if (!name || !issueNumber || !publicationDate || !artistId) {
    res.status(400).send();
  } else {
    const sqlInsert =
      "UPDATE Issue SET" +
      "name = $name, issue_number = $issueNumber, publication_date = $publicationDate, series_id = $seriesId, artist_id = $artistId)";
    const values = {
      $name: name,
      $issueNumber: issueNumber,
      $publicationDate: publicationDate,
      $artistId: artistId,
      $seriesId: req.params.seriesId,
    };

    db.run(sql, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Issue WHERE Issue.series_id = ${req.params.seriesId}`,
          (error, issue) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ issue: issue });
            }
          }
        );
      }
    });
  }
});

issuesRouter.delete("/:issueId", (req, res, next) => {
  db.run(
    "DELETE FROM Issue WHERE Issue.id = $issueId",
    { $issueId: req.params.issueId },
    function (error) {
      if (error) {
        next(error);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

module.exports = issuesRouter;
