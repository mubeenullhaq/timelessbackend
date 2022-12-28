const xmlparser = require("express-xml-bodyparser");
const express = require("express");
const cors = require("cors");
const timeless = require("../routes/timeless");

module.exports = function (app) {
  app.use(xmlparser());
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());

  app.use("/api/timeless", timeless);
};
