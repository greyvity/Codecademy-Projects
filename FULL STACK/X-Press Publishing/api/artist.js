const express = require("express");
const artistsRouter = express.Router();

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

artistsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE is_currently_employed = 1",
    (error, artists) => {
      console.log("HERE");
      if (error) {
        next(error);
      } else {
        res.status(200).json({ artists: artists });
      }
    }
  );
});

artistsRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE Artist.id = $artistId",
    { $artistId: artistId },
    (error, artist) => {
      if (error) {
        next(error);
      } else if (!artist) {
        res.status(404).send("INVALID");
      } else {
        req.artist = artist;
        req.artistId = artistId;
        next();
      }
    }
  );
});

artistsRouter.get("/:artistId", (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

artistsRouter.post("/", (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const isEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;

  if (name && dateOfBirth && biography) {
    const sqlInsert =
      "INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)" +
      "VALUES ($name, $dateOfBirth, $biography, $isEmployed)";
    db.run(
      sqlInsert,
      {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isEmployed: isEmployed,
      },
      function (error) {
        if (error) {
          next(error);
        } else {
          db.get(
            `SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
            (error, artist) => {
              if (error) {
                next(error);
              } else {
                res.status(201).json({ artist: artist });
              }
            }
          );
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
});

artistsRouter.put("/:artistId", (req, res, next) => {
  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;

  const sqlUpdate =
    "UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE Artist.id = $artistId";

  const values = {
    $name: name,
    $dateOfBirth: dateOfBirth,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $artistId: req.params.artistId,
  };

  if (!name || !dateOfBirth || !biography) {
    res.sendStatus(400);
  }

  db.run(sqlUpdate, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(
        `SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
        (error, artist) => {
          res.status(200).json({ artist: artist });
        }
      );
    }
  });
});

artistsRouter.delete("/:artistId", (req, res, next) => {
  const sqlUpdate =
    "UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId";
  const values = {
    $artistId: req.artistId,
  };

  db.run(sqlUpdate, values, (error) => {
    if (error) {
      next(error);
    }

    db.get(
      `SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
      (error, artist) => {
        res.status(200).json({ artist: artist });
      }
    );
  });
});

module.exports = artistsRouter;
