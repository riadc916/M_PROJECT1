const mongoose = require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");  

const listingSchema = new mongoose.Schema ({
  title : String,
  description : String,
  image :{
    url:String,
    filename:String
      },
  price : Number,
  location : String,
  country : String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  Category:{
    type:String,
    enum:["Trending","Room","Iconic Cities","Mountain","Castles","Amazing Pool","Camping","Farms","Arctic","Boats"]
  }
}); 




listingSchema.post("findOneAndDelete",async (listing)=>{
   if(listing){
    await Review.deleteMany({
      _id:{$in: listing.reviews}
    })
   }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
