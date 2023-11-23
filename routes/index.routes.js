const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

/* GET home page */
router.get("/", isLoggedOut, async (req, res, next) => {
  const noUser = { name: "noUser", name1: "adasd" };
  res.render("mainpage.hbs", { noUser });
});

module.exports = router;
