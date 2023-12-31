const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("..//models/User.model");
const Museum = require("../models/Museum.model");
const Restaurant = require("../models/Restaurants.model");
const Hotel = require("../models/Hotel.model.js");
const Review = require("../models/Review.model");
const uploader = require("../middlewares/cloudinary.config.js");
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

router.get("/signup", isLoggedOut, async (req, res, next) => {
  try {
    const noUser = { name: "noUser", name1: "adasd" };
    res.render("auth/signup.hbs", { noUser });
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", isLoggedOut, async (req, res, next) => {
  try {
    const noUser = { name: "noUser", name1: "adasd" };
    res.render("auth/login", { noUser });
  } catch (error) {
    console.log(error);
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const currentUser = req.session.currentUser;
    const idUser = currentUser._id;
    const currentUser1 = await User.findById(idUser);
    let foundActivity = [];
    for (let i = 0; i < currentUser1.reviews.length; i++) {
      let review = await Review.findById(currentUser1.reviews[i])
        .populate("activity")
        .populate("user");
      foundActivity.push(review);
    }
    res.render("auth/profile", { user: currentUser1, review: foundActivity });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    let response = await User.findOne({ username: req.body.username });
    if (!response) {
      const salt = await bcryptjs.genSaltSync(12);
      const hashedPassword = await bcryptjs.hashSync(req.body.password, salt);
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        image:
          "https://res.cloudinary.com/dnr0j82bs/image/upload/v1700156447/ywicr3exjnl3gv8xkjuq.jpg",
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
        foundUser.password = "XXXX";
        req.session.currentUser = foundUser;
        res.redirect("/auth/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect Details" });
      }
    }
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
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/profile/:id/editprofile", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const findUser = await User.findById(id);
    res.render("edit/editprofile", { User: findUser });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/profile/:id/editprofile",
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      if (!req.file) {
        const addCity = await User.findByIdAndUpdate(id, {
          ...data,
          image:
            "https://res.cloudinary.com/dnr0j82bs/image/upload/v1700156447/ywicr3exjnl3gv8xkjuq.jpg",
        });
      } else {
        const userUpdate = await User.findByIdAndUpdate(id, {
          ...data,
          image: req.file.path,
        });
      }
      res.redirect("/auth/profile/");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
