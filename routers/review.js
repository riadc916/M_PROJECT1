const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");  
const {reviewSchema}=require("../joiSchema.js");  //for joi schema validation 
const ExpressError=require("../utils/Expresserror.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");




// this is a validation cheacking means server side validation
const ValidateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


//Review route
//post review route
router.post("/",ValidateReview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let new_review=new Review(req.body.review);
    listing.reviews.push(new_review);
    await new_review.save();
    await listing.save();
    req.flash("success","Successfully created a new review!");
    res.redirect(`/listings/${listing.id}`);
}))



//Delete Review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     //this is for delete the review from the review array in listing
       await Review.findByIdAndDelete(reviewId); //this one is delete for the review collection
       req.flash("success","Successfully deleted the review!");
        res.redirect(`/listings/${id}`);
}))


module.exports=router;