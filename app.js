// Passport.js → email/password যাচাই করে (strategy দিয়ে)

// Passport.js → ইউজারকে session এ রাখে

// Express-session → সেই session এর একটা session ID generate করে

// Browser-এ cookie হিসেবে connect.sid=xyz পাঠায়

// এরপর যতবার request আসে, সেই cookie (session ID) পাঠায়

// Server সেই session ID দিয়ে বুঝে নেয় ইউজার কে
//npm init -y///npm i express///npm i ejs///npm i mongoose///npm i method-verride//npm i multer//npm i cloudinary//npm i multer-storage-cloudinary
// //npm i passport //passport-local //passport-local-mongoose its only use for authenticationA


if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// const { render } = require("ejs");
const engine = require("ejs-mate");
const ExpressError=require("./utils/Expresserror.js");
const session=require("express-session")
const flash=require("connect-flash");  //this is for flash message show in the browser 
//  we create a new listing
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;   
const User=require("./models/user.js");


const listingsRouter=require("./routers/listing.js");
const reviewsRouter= require("./routers/review.js");
const userRouter= require("./routers/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.json());


const sessionOptions={
    secret:"mysecretSession",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}
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


app.use(session(sessionOptions))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Step-by-step Workflow:
// User Login Form Submit করে



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");     //এখন থেকে সব EJS ফাইলে app.user accessible হবে।
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.use("/listings",listingsRouter);  //this is for listing route  etar 
// nam hocce expressrouter jeta kina code ke more readable kore
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter);  //this is for user route




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

