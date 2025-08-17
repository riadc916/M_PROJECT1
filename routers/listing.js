const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const User = require("./user.js"); //for user authentication check
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController=require("../controllers/listing.js");

//index route
router.get(
  "/",
  wrapAsync(listingController.indexcontroller) //using the index function from listingControllerss
);

//new route
router.get("/new", isLoggedIn,listingController.newcontroller);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showcontroller));

//create route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.createrouter));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editcontroller)
);

//update edit route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updatecontroller)
);
//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deletecontroller)
);

module.exports = router;
