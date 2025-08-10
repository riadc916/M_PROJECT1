module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //store the original url in session kon page theke user login korar chesta korche
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login"); //if user not logged in then redirect to login page
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
