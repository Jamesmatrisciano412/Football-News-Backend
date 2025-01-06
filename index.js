const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./database");
const port = process.env.PORT || 8080;
const app = express();

//Have Node server the files for built React app
// app.use(express.static(path.resolve(__dirname, './client/build')));

const routes = require('./routes/index');

//Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes);

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// })

app.listen(port, () => console.log(`Server is listening on port ${port}`));