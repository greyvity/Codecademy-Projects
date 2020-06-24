const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

const table = "CREATE TABLE IF NOT EXISTS ";

const employeeTable =
  table +
  "Employee (" +
  "'id' INTEGER NOT NULL PRIMARY KEY," +
  "'name' TEXT NOT NULL," +
  "'position' TEXT NOT NULL," +
  "'wage' INTEGER NOT NULL," +
  "'is_current_employee' INTEGER NOT NULL DEFAULT 1 )";

const timeSheetTable =
  table +
  "Timesheet (" +
  "'id' INTEGER NOT NULL PRIMARY KEY," +
  "'hours' INTEGER NOT NULL," +
  "'rate' INTEGER NOT NULL," +
  "'date' INTEGER NOT NULL," +
  "'employee_id' INTEGER NOT NULL)";

const menuTable =
  table +
  "Menu (" +
  "'id' INTEGER PRIMARY KEY NOT NULL, " +
  "'title' TEXT NOT NULL )";

const menuItemTable =
  table +
  "MenuItem (" +
  "'id' INTEGER NOT NULL PRIMARY KEY," +
  "'name' TEXT NOT NULL," +
  "'description' TEXT NOT NULL," +
  "'inventory' INTEGER NOT NULL," +
  "'price' INTEGER NOT NULL," +
  "'menu_id' INTEGER NOT NULL )";

db.serialize(() => {
  db.run(employeeTable);
  db.run(timeSheetTable);
  db.run(menuTable);
  db.run(menuItemTable);
});
