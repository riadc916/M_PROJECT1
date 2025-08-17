const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let new_review = new Review(req.body.review);
    new_review.author=req.user._id; //set the author of the review to the logged in user
    listing.reviews.push(new_review);
    await new_review.save();
    await listing.save();
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${listing.id}`);
  }

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId.trim() } });
    //this is for delete the review from the review array in listing
    await Review.findByIdAndDelete(reviewId.trim()); //this one is delete for the review collection
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
  }