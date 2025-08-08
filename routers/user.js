const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

//For signuo info
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      let newuser = new User({ email, username });
      let usersave = await User.register(newuser, password);
      console.log(usersave);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
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
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome back!");
    res.redirect("/listings");
  }
);
//logout info
//logout is a passport method
router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Successfully logged out!")
    res.redirect("/listings");
  })
})

module.exports = router;
