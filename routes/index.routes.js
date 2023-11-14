const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  res.render("mainpage.hbs");
});

module.exports = router;
