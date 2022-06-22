const mysql = require("mysql");
const mySql = mysql.createConnection({
  host: process.env.HOST || "localhost",
  user: "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "todo_app",
});

module.exports = { mySql };
