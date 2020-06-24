const express = require("express");
const menuItemRouter = express.Router({ mergeParams: true });

// database import and instantiate
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

menuItemRouter.get("/", (req, res, next) => {
  db.all(
    `SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`,
    (error, menuItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ menuItems: menuItems });
      }
    }
  );
});

menuItemRouter.post("/", (req, res, next) => {
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;

  if (!name || !description || !inventory || !price) {
    res.status(400).send();
  } else {
    const sqlInsert =
      "INSERT INTO MenuItem (name, description, inventory, price, menu_id) " +
      "VALUES ($name, $description, $inventory, $price, $menuId)";
    const values = {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuId: req.params.menuId,
    };

    db.run(sqlInsert, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
          (error, menuItem) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ menuItem: menuItem });
            }
          }
        );
      }
    });
  }
});

menuItemRouter.param("menuItemId", (req, res, next, menuItemId) => {
  db.get(
    `SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
    (error, menuItem) => {
      if (error) {
        next(error);
      } else if (menuItem) {
        req.menuItem = menuItem;
        next();
      } else {
        res.status(404).send();
      }
    }
  );
});

menuItemRouter.put("/:menuItemId", (req, res, next) => {
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;

  if (!name || !description || !inventory || !price) {
    res.status(400).send();
  } else {
    const sqlUpdate =
      "UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId ";
    const values = {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuId: req.params.menuId,
      $menuItemId: req.params.menuItemId,
    };

    db.run(sqlUpdate, values, function (error) {
      if (error) {
        next(error);
      } else {
        db.get(
          `SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
          (error, menuItem) => {
            if (error) {
              next(error);
            } else {
              res.status(200).json({ menuItem: menuItem });
            }
          }
        );
      }
    });
  }
});

menuItemRouter.delete("/:menuItemId", (req, res, next) => {
  db.run(
    `DELETE FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
    function (error) {
      if (error) {
        next(error);
      } else {
        res.status(204).json({ menuItem: req.menuItem });
      }
    }
  );
});

module.exports = menuItemRouter;
