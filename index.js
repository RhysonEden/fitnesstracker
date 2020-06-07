const PORT = 3000;
require("dotenv").config();

const express = require("express");
const server = express();
const bodyParser = require("body-parser");
server.use(bodyParser.json());
const { client } = require("./db/client");
client.connect();

const morgan = require("morgan");
server.use(morgan("dev"));

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
