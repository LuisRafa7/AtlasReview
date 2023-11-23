const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");
const Museum = require("../models/Museum.model");
const Restaurant = require("../models/Restaurants.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Hotel = require("../models/Hotel.model");
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

router.get("/:id/editreview", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id).populate("activity");
    res.render("edit/editreview", { Review: review });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/editreview", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const addCity = await Review.findByIdAndUpdate(id, data);
    res.redirect("/auth/profile/");
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.session.currentUser._id;
    const findReview = await Review.findById(id);
    const activityId = findReview.activity;
    const deleteReview = await Review.findByIdAndDelete(id);
    const update = await User.findByIdAndUpdate(userId, {
      $pull: { reviews: id },
    });
    const update1 = await Museum.findByIdAndUpdate(activityId, {
      $pull: { reviews: id },
    });
    const update2 = await Restaurant.findByIdAndUpdate(activityId, {
      $pull: { reviews: id },
    });
    const update3 = await Hotel.findByIdAndUpdate(activityId, {
      $pull: { reviews: id },
    });
    res.redirect("/auth/profile/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
