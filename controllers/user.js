const User=require("../models/user.js");
module.exports.rendersignup=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signupcontroller=async (req, res, next) => {
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
  }

  module.exports.renderlogin=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //user jodi login page theke ashe tahole default e /listings e redirect hobe
    res.redirect(redirectUrl); //redirect to the original URL stored in session (middleware.js )
    // delete req.session.redirectUrl; // Clear the redirect URL after use
  }

  module.exports.logout=(req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/listings");
  });
}