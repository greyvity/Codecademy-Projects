const express = require("express");
const menuRouter = express.Router();

// database import and instantiate
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const menuItemRouter = require("./menuItem");
menuRouter.use("/:menuId/menu-items", menuItemRouter);

menuRouter.get("/", (req, res, next) => {
  db.all(`SELECT * FROM Menu`, (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({ menus: menus });
    }
  });
});

menuRouter.post("/", (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    res.status(400).send();
  } else {
    const sqlInsert = "INSERT INTO Menu(title) VALUES($title)";
    values = { $title: title };
    db.run(sqlInsert, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
          (error, menu) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ menu: menu });
            }
          }
        );
      }
    });
  }
});

menuRouter.param("id", (req, res, next, id) => {
  db.get(
    `SELECT * FROM Menu WHERE Menu.id = ${req.params.id}`,
    (error, menu) => {
      if (error) {
        next(error);
      } else if (menu) {
        req.menu = menu;
        next();
      } else {
        res.status(404).send();
      }
    }
  );
});

menuRouter.param("menuId", (req, res, next, menuId) => {
  db.get(
    `SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`,
    (error, menu) => {
      if (error) {
        next(error);
      } else if (menu) {
        req.menu = menu;
        next();
      } else {
        res.status(404).send();
      }
    }
  );
});

menuRouter.put("/:id", (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    res.status(400).send();
  } else {
    const sqlUpdate = "UPDATE Menu SET title = $title WHERE Menu.id = $menuId";
    const values = {
      $title: title,
      $menuId: req.params.id,
    };
    db.run(sqlUpdate, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM Menu WHERE Menu.id = ${req.params.id}`,
          (error, menu) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ menu: menu });
            }
          }
        );
      }
    });
  }
});

menuRouter.get("/:id", (req, res, next) => {
  res.status(200).json({ menu: req.menu });
});

menuRouter.delete("/:id", (req, res, next) => {
  db.get(
    `SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.id}`,
    (error, menuItem) => {
      if (error) {
        next(error);
      } else if (menuItem) {
        res.status(400).send();
      } else {
        db.run(`DELETE FROM Menu WHERE Menu.id = ${req.params.id}`, function (
          error
        ) {
          if (error) {
            next(error);
          } else {
            res.status(204).json({ menu: req.menu });
          }
        });
      }
    }
  );
});

module.exports = menuRouter;
