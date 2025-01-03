const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./config/environment");
require("./database");
const port = 8080;
const app = express();

const routes = require('./routes/index');

//Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));