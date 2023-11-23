const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/auth/profile");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
