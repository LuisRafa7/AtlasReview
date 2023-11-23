const express = require("express");
const router = express.Router();
const Country = require("..//models/Country.model");
const City = require("../models/City.model");
const uploader = require("../middlewares/cloudinary.config");
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

router.get("/", isLoggedIn, async (req, res, next) => {
  const allCountries = await Country.find();
  const user = req.session.currentUser;
  if (user.username === "admin") {
    res.render("index", { Countries: allCountries, Admin: user });
  } else {
    res.render("index", { Countries: allCountries, User: user });
  }
});

router.get("/addcountry", isLoggedIn, async (req, res, next) => {
  try {
    res.render("add/addcountry.hbs");
  } catch (error) {
    console.log(error);
  }
});

router.post("/addcountry", uploader.single("image"), async (req, res, next) => {
  try {
    const data = req.body;
    if (!req.file) {
      const addCity = await Country.create({
        ...data,
        image:
          "https://res.cloudinary.com/dnr0j82bs/image/upload/v1700156447/ywicr3exjnl3gv8xkjuq.jpg",
      });
    } else {
      const addCity = await Country.create({ ...data, image: req.file.path });
    }
    res.redirect("/country/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/editcountry", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    res.render("edit/editcountry.hbs", { Country: country });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/:id/editcountry",
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const country = await Country.findById(id);
      const data = req.body;
      if (!req.file) {
        const addCity = await Country.findByIdAndUpdate(id, {
          ...data,
          image: country.image,
        });
      } else {
        const addCity = await Country.findByIdAndUpdate(id, {
          ...data,
          image: req.file.path,
        });
      }

      res.redirect("/country/");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/:id/addcity", isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const country = await Country.findById(id);
    console.log(country);
    res.render("add/addcity.hbs", { Country: country });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/:id/addcity",
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const country = await Country.findById(id);
      const data = req.body;
      if (!req.file) {
        const addCity = await City.create({
          ...data,
          country: country._id,
          image:
            "https://res.cloudinary.com/dnr0j82bs/image/upload/v1700156447/ywicr3exjnl3gv8xkjuq.jpg",
        });
      } else {
        const addCity = await City.create({
          ...data,
          country: country._id,
          image: req.file.path,
        });
      }
      const update = await Country.findByIdAndUpdate(id, {
        $push: { cities: addCity._id },
      });
      res.redirect("/country/" + id + "/details");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/:id/details", isLoggedIn, async (req, res, next) => {
  try {
    let id = req.params.id;
    const country = await Country.findById(id).populate("cities");
    const user = req.session.currentUser;
    if (user.username === "admin") {
      res.render("cities", { Country: country, Admin: user });
    } else {
      res.render("cities", { Country: country, User: user });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
