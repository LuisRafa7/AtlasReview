const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");
const Museum = require("../models/Museum.model");
const Restaurant = require("../models/Restaurants.model");
const Review = require("../models/Review.model");
const Hotel = require("../models/Hotel.model");

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findById(id)
      .populate("location")
      .populate("reviews");
    res.render("hotel.hbs", { Hotel: hotel });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/review", async (req, res, next) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
    res.render("reviewimg.hbs", { Hotel: hotel });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/review", async (req, res, next) => {
  try {
    const title = req.body.title;
    const evaluation = req.body.evaluation;
    const comment = req.body.comment;
    const id = req.params.id;
    const museum = await Hotel.findById(id);
    const newReview = await Review.create({
      title: title,
      evaluation: evaluation,
      comment: comment,
      date: Date.now(),
      activity: museum._id,
    });
    const update = await Hotel.findByIdAndUpdate(id, {
      $push: { reviews: newReview._id },
    });
    res.redirect("/restaurant/" + id);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
