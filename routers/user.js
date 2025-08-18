const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller=require("../controllers/user.js");

//For signuo info
router.get("/signup", usercontroller.rendersignup);

router.post(
  "/signup",
  wrapAsync(usercontroller.signupcontroller));

//for login info
router.get("/login", usercontroller.renderlogin);


router.post(
  "/login",
  saveRedirectUrl,
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
