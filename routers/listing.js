const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const User = require("./user.js"); //for user authentication check
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");


//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("../views/listings/index.ejs", { alllistings });
  })
);

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("../views/listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      return res.redirect("/listings"); //index.ejs
    }
    let isOwner=req.user && req.user._id.equals(listing.owner._id);  //we are going to use this in show.ejs
    console.log(listing);
    res.render("../views/listings/show.ejs", { listing,isOwner });
  })
);

//create route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;
    listingData.image = {
      url: listingData.image,
      filename: "custom-filename", // or extract from URL if needed
    };
    const newlisting = new Listing(listingData);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  })
);
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", { listing });
  })
);

//update edit route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  })
);
//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "Successfully delete the listing!");
    res.redirect("/listings");
  })
);

module.exports = router;
