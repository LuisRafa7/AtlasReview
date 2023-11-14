const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("..//models/User.model");
const Museum = require("../models/Museum.model");
const Restaurant = require("../models/Restaurants.model");
const Hotel = require("../models/Hotel.model.js");
const Review = require("../models/Review.model");
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

router.get("/signup", async (req, res, next) => {
  try {
    res.render("auth/signup.hbs");
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    res.render("auth/login");
  } catch (error) {
    console.log(error);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    res.render("auth/profile");
  } catch (error) {
    console.log(error);
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile", { userInSession: req.session.currentUser });
});

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let response = await User.findOne({ username: req.body.username });
    if (!response) {
      const salt = await bcryptjs.genSaltSync(12);
      const hashedPassword = await bcryptjs.hashSync(req.body.password, salt);
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    } else {
      res.render("auth/signup", { errorMessage: "Username already taken" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let foundUser = await User.findOne({ email: req.body.email })
      .populate("reviews")
      .populate();
    let foundActivity = [];
    for (let i = 0; i < foundUser.reviews.length; i++) {
      let review = await Review.findById(foundUser.reviews[i])
        .populate("activity")
        .populate("user");
      foundActivity.push(review);
    }

    if (!foundUser) {
      res.render("auth/login", { errorMessage: "Please try again" });
    } else {
      const doesPasswordMatch = await bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (doesPasswordMatch) {
        res.render("auth/profile", { user: foundUser, review: foundActivity });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect Details" });
      }
    }
    req.session.currentUser = foundUser;
    console.log("SESSION =====> ", req.session);
  } catch (error) {
    console.log(error);
  }
});

router.post("/logout/", async (req, res, next) => {
  try {
    let destroy = await req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.redirect("/auth/login");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
