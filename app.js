// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
require("./config/session.config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "AtlasReview";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const countryRoutes = require("./routes/country.routes");
app.use("/country/", countryRoutes);

const cityRoutes = require("./routes/cities.routes");
app.use("/city/", cityRoutes);

const museumRoutes = require("./routes/museum.routes");
app.use("/museum/", museumRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth/", authRoutes);

const restaurantRoutes = require("./routes/restaurant.routes");
app.use("/restaurant/", restaurantRoutes);

const hotelRoutes = require("./routes/hotel.routes");
app.use("/hotel/", hotelRoutes);

const reviewRoutes = require("./routes/review.routes");
app.use("/review/", reviewRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
