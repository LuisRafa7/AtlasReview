const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");

router.get("/", async (req, res, next) => {
  const allCountries = await Country.find();
  res.render("index", { Countries: allCountries });
});

router.get("/addcountry", async (req, res, next) => {
  try {
    res.render("add/addcountry.hbs");
  } catch (error) {
    console.log(error);
  }
});

router.post("/addcountry", async (req, res, next) => {
  try {
    const data = req.body;
    const addCity = await Country.create(data);
    res.redirect("/country/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/editcountry", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    res.render("edit/editcountry.hbs", { Country: country });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/editcountry", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const addCity = await Country.findByIdAndUpdate(id, { data });
    res.redirect("/country/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/addcity", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    console.log(country);
    res.render("add/addcity.hbs", { Country: country });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/addcity", async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    const data = req.body;
    const addCity = await City.create({ ...data, country: country._id });
    const update = await Country.findByIdAndUpdate(id, {
      $push: { cities: addCity._id },
    });
    res.redirect("/country/" + id + "/details");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/details", async (req, res, next) => {
  try {
    let id = req.params.id;
    const country = await Country.findById(id).populate("cities");
    res.render("cities", { Country: country });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
