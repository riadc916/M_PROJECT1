const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//For signuo info
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      let newuser = new User({ email, username });
      let usersave = await User.register(newuser, password);
      console.log(usersave);
      req.login(usersave, (err) => {
        //eikhane signup korar por user ke login kore dewa hocche
        if (err) {
          return next(err);
        } else {
          req.flash("success", "Welcome to Wanderlust!");
          res.redirect("/listings");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

//for login info
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    //er kaj hocce user ke authenticate kora
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //user jodi login page theke ashe tahole default e /listings e redirect hobe
    res.redirect(redirectUrl); //redirect to the original URL stored in session (middleware.js )
    // delete req.session.redirectUrl; // Clear the redirect URL after use
  }
);
//logout info
//logout is a passport method
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
