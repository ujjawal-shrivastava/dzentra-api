const api = require("express").Router();

api.use("/ping", async (req, res) => {
  res.send("Pong");
});

api.use("/signup", require("./signup"));
api.use("/login", require("./login"));

module.exports = api;
