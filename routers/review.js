const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { ValidateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js"); //for review validation

const reviewController=require("../controllers/review.js")

//Review route
//post review route
router.post(
  "/",
  isLoggedIn,
  ValidateReview,
  wrapAsync(reviewController.createReview));

//Delete Review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview));

module.exports = router;
