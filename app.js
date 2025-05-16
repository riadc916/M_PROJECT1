const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
// const { render } = require("ejs");
const engine=require("ejs-mate");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine('ejs', engine);


//npm init -y///npm i express///npm i ejs///npm i mongoose///npm i method-verride


main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
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

//index route
app.get("/listings",async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("../views/listings/index.ejs",{alllistings});
})


//new route
app.get("/listings/new",(req,res)=>{
    res.render("../views/listings/new.ejs");
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("../views/listings/show.ejs",{listing});
    
})
//create route
app.post("/listings",async(req,res)=>{
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    console.log(newlisting);
    res.redirect("/listings");  
    console.log(req.body)
})
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("../views/listings/edit.ejs",{listing});
})

//update edit route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})




app.listen(8080,()=>{
    console.log("sever is listening to port 8080");
})