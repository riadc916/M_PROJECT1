const Listing=require("../models/listing.js");

module.exports.indexcontroller=async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("../views/listings/index.ejs", { alllistings });
  }

module.exports.newcontroller=(req, res) => {
  res.render("../views/listings/new.ejs");
}

module.exports.showcontroller=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        //this is for poppulate the reviews and
        // author of the review we can use show.ejs review.author.username
        path: "reviews",
        populate: {
          path: "author",
        },
      }) //populate the reviews and author of the review})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      return res.redirect("/listings"); //index.ejs
    }
    let isOwner = req.user && req.user._id.equals(listing.owner._id); //we are going to use this in show.ejs
    console.log(listing);
    res.render("../views/listings/show.ejs", { listing, isOwner });
  }

module.exports.createrouter=async (req, res, next) => {
  let url=req.file.path;    //use cloudinary
  let filename=req.file.filename;   //here use cloudinary
    const listingData = req.body.listing;
    listingData.image = {
      url: listingData.image,
      filename: "custom-filename", // or extract from URL if needed
    };
    listingData.image={url,filename};  //use cloudinary
    const newlisting = new Listing(listingData);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  }

  module.exports.editcontroller=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250");
    res.render("../views/listings/edit.ejs", { listing,originalUrl });
  }

  // module.exports.updatecontroller=async (req, res) => {
  //   let { id } = req.params;
  //   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //   req.flash("success", "Successfully updated the listing!");
  //   res.redirect(`/listings/${id}`);
  // }

  module.exports.updatecontroller = async (req, res) => {
  let { id } = req.params;
  const listingData = req.body.listing;
  let listing=await Listing.findByIdAndUpdate(id, listingData);
  // যদি image object থেকে url আসে, তাহলে filename ম্যানুয়ালি দিয়ে দাও
  if (listingData.image && listingData.image.url) {
    listingData.image.filename = "updated-from-edit"; // অথবা ইচ্ছেমত কিছু
  }

 
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

  module.exports.deletecontroller=async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "Successfully delete the listing!");
    res.redirect("/listings");
  }

  module.exports.categorycontroller=async(req,res)=>{
    let {category}=req.params;
    const listings=await Listing.find({Category:category})
    // if (!alllistings || alllistings.length==0){
    //   req.flash("error","No listings found in this category");
    //   return res.redirect("/listings");
    // }
    res.render("../views/listings/category.ejs",{listings,category});
  }
  module.exports.searchcontroller=async(req,res)=>{
    const search=req.query.country;
    let listings=[]
    if(search){
      listings=await Listing.find({
        country: { $regex: search, $options: "i" } 
      })
    }
    res.render("../views/listings/search.ejs",{listings,search})
  }