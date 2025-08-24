const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller=require("../controllers/user.js");



router.route("/signup")   //for signup info
.get( usercontroller.rendersignup)
.post(wrapAsync(usercontroller.signupcontroller));



router.route("/login")   //this is for login info
.get(usercontroller.renderlogin)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    //er kaj hocce user ke authenticate kora
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontroller.login
);


//logout info
//logout is a passport method
router.get("/logout", usercontroller.logout);

module.exports = router;
