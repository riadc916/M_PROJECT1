module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create a listing!");
        return res.redirect("/login");  //if user not logged in then redirect to login page
    }
    next();
}