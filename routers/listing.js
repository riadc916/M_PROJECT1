const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const User = require("./user.js"); //for user authentication check
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')   //used for image/video upload files
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage})
  
router //this is going to handle the index/create route for listings because index and create are in the same route
  .route("/")
  .get(wrapAsync(listingController.indexcontroller)) //using the index function from listingControllerss/ /index route
  .post(
    isLoggedIn, 
    validateListing, //create route
    upload.single("listing[image]"), 
    wrapAsync(listingController.createrouter)
  );


router.get("/search",wrapAsync(listingController.searchcontroller))
//new route
router.get("/new", isLoggedIn, listingController.newcontroller);

router
  .route("/:id")   //this is going to handle the show/update/delete route for listings
  .get(wrapAsync(listingController.showcontroller))
                            //why upload is before validatelisting because first we multer parse the image then save the image in the cloudinary and then validate the rest of the data
  .put(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updatecontroller))
  .delete(isLoggedIn,
  isOwner,
  wrapAsync(listingController.deletecontroller));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editcontroller)
);
  
router.get("/category/:category",isLoggedIn,wrapAsync(listingController.categorycontroller))



module.exports = router;
