// const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

const initRoutes = require("./src/routes");
const connection = require("./src/connection/connection");

//var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

connection.mySql.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected!");
});

const port = process.env.PORT;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Running at localhost:${port}`);
});
