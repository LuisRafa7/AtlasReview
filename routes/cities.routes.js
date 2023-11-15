const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");
const Museum = require("../models/Museum.model");
const Restaurant = require("../models/Restaurants.model");
const Hotel = require("../models/Hotel.model");
const uploader = require("../middlewares/cloudinary.config");

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id)
      .populate("museum")
      .populate("restaurants")
      .populate("hotels")
      .populate("country");
    res.render("activities.hbs", { City: city });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/addmuseum", async (req, res, next) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id);
    res.render("add/addmuseum.hbs", { City: city });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/addmuseum", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const addMusem = await Museum.create({ ...data, location: id });
    const update = await City.findByIdAndUpdate(id, {
      $push: { museum: addMusem._id },
    });
    res.redirect("/city/" + id);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/addrestaurant", async (req, res, next) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id);
    res.render("add/addrestaurant.hbs", { City: city });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/addrestaurant", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const addRestaurant = await Restaurant.create({ ...data, location: id });
    const update = await City.findByIdAndUpdate(id, {
      $push: { restaurants: addRestaurant._id },
    });
    res.redirect("/city/" + id);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/addhotel", async (req, res, next) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id);
    res.render("add/addhotel.hbs", { City: city });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/addhotel", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const addHotel = await Hotel.create({ ...data, location: id });
    const update = await City.findByIdAndUpdate(id, {
      $push: { hotels: addHotel._id },
    });
    res.redirect("/city/" + id);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/editcity", async (req, res, next) => {
  try {
    const id = req.params.id;
    const city = await City.findById(id).populate("country");
    res.render("edit/editcity.hbs", { City: city });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/:id/editcity",
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const city = await City.findById(id).populate("country");
      const addCity = await City.findByIdAndUpdate(id, {
        ...data,
        country: city.country._id,
        image: req.file.path,
      });
      res.redirect("/country/" + city.country._id + "/details");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
