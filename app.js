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


const listingsRouter=require("./routers/listing.js");
const reviews = require("./routers/review.js");


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

app.use(session(sessionOptions))
app.use(flash());

//npm init -y///npm i express///npm i ejs///npm i mongoose///npm i method-verride


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


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



app.use("/listings",listingsRouter);  //this is for listing route  etar 
// nam hocce expressrouter jeta kina code ke more readable kore
app.use("/listings/:id/reviews",reviews)




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

