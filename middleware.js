const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError = require("./utils/Expresserror.js");
const { listingSchema,reviewSchema } = require("./joiSchema.js"); //for joi schema validation


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

module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You are not the owner of this page!");
        return res.redirect(`/listings/${id}`); //redirect to the show page of that listing
    }
  next();
}


module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); //joi function only return {value and error}
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next(); //next er kaj holo route   (req,res){} eita hocche route/route handeler  and /listing route path
  }
};


// this is a validation cheacking means server side validation
module.exports.ValidateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


module.exports.isReviewAuthor=async (req,res,next)=>{
  let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the owner of this page!");
        return res.redirect(`/listings/${id}`); //redirect to the show page of that listing
    }
  next();
}