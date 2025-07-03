const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
// const { render } = require("ejs");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/Expresserror.js");
const { error } = require("console");
const {listingSchema}=require("./joiSchema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.json());


//npm init -y///npm i express///npm i ejs///npm i mongoose///npm i method-verride


main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// app.get("/testlisting",async(req,res)=>{
//   let sampletesting=new Listing({
//     title:"My new villa",
//     description:"By the hill",
//     price:200,
//     location:"Nantong",
//     country:"China",
//   })
//   let show=await sampletesting.save();
//   console.log("save successful");
//   res.send(show);
// })



const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();   //next er kaj holo route   (req,res){} eita hocche route/route handeler  and /listing route path
    }
};




//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("../views/listings/index.ejs", { alllistings });
}));


//new route
app.get("/listings/new", (req, res) => {
    res.render("../views/listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/show.ejs", { listing });

}))


// // create route
// app.post("/listings",async(req,res,next)=>{
//     try{
//         const newlisting=new Listing(req.body.listing);
//     await newlisting.save();
//     res.redirect("/listings");
//     }catch(err){
//      next(err)
//     }

// })
//create route
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
    const listingData = req.body.listing;
    listingData.image = {
        url: listingData.image,
        filename: "custom-filename" // or extract from URL if needed
    };
    const newlisting = new Listing(listingData);
    await newlisting.save();
    res.redirect("/listings");
})
)
//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../views/listings/edit.ejs", { listing });
}))

//update edit route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))
//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.get("/", (req, res) => {
    // res.send("Hi, I am root");
    res.render("../views/listings/home.ejs");
})

//for all the route
app.all(/^.*$/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

//error handeling
//Destructuring mane holo let {statusCode=500,message="something"}=err;
app.use((err, req, res, next) => {
    let{statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})



app.listen(8080, () => {
    console.log("sever is listening to port 8080");
})