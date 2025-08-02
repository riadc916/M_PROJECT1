const express=require("express");
const app=express();
const path = require("path");
const flash=require("connect-flash")



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

//cookie-parser

// const cookieParser=require("cookie-parser");


// app.use(cookieParser("secretKey")); // Use a secret key for signing cookies



// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("name","Chowdhury",{signed:true});
//     res.send("signed cookie has been sent");
// })
// app.get("/verifycookie",(req,res)=>{
//     console.log(req.signedCookies) // Access signed cookies
//     console.log(req.cookies) // Access unsigned cookies
//     res.send("verifyed")
// })

// app.get("/getcookie",(req,res)=>{
//     res.cookie("Riad","Good boy")
//     res.cookie("Mahmud","Excellent")
//     res.send("Send you some cookies");
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("I am root route");
// })
// const users=require("./router/user.js");
// const posts=require("./router/post.js");


// app.use("/users",users);
// app.use("/posts",posts);




//Express Session

//stateless protocol =http
//sessionid =use for serverside and stateful protocol
//session id tai cookie ta mone rakhe 
// 🔹 Session মানে কী?
// Session হলো সার্ভারের একটি ছোট জায়গা, যেখানে কোনো ইউজারের তথ্য (যেমন: username, login status ইত্যাদি) সংরক্ষণ করা হয়।

// প্রতিটি ইউজারকে সার্ভার একটি unique session ID দেয়। এটি ব্রাউজারে cookie হিসেবে সেভ থাকে।

// 🔹 Single Session বলতে কী বোঝায়?
// Single session মানে হলো:
// একজন ইউজারের জন্য একটিই session ID তৈরি হবে যতক্ষণ না সে ব্রাউজার বন্ধ করে দেয় বা manually logout করে।

//  তুমি যতবারই রিকোয়েস্ট পাঠাও (একই ব্রাউজার থেকে), session একটিই থাকবে।
// for the production environment use does not use memory store we use  compatible session stores.
const session=require('express-session');



const sessionOptions={secret:"mysecretSessionid",
    resave:false,
    saveUninitialized:true}

app.use(session(sessionOptions))



app.use(flash())
// connect-flash ব্যবহার করা হয় temporary message দেখানোর জন্য, যেমন:

// Login successful
//  Invalid username or password
//  "Post created successfully"
//  "You must be logged in to view this page"   একবার দেখিয়ে মুছে ফেলা হয় এমন message।
// connect-flash ব্যবহার করি temporary success/failure message 
// দেখানোর জন্য, যা একবার দেখানোর পর session থেকে মুছে যায়।


// we create this local 
app.use((req,res)=>{
    res.locals.successMsg=req.flash("success")  //  local: this use for only ejs template no need
    // to mention ejs template
    res.locals.errorMsg=req.flash("error")
})


app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name=="anonymous"){
        req.flash("error","user not register successful")
    }else{
        req.flash("success","user register")
    }
    console.log(req.session.name)
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name , msg:req.flash("success")})
})



// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you have visited this page ${req.session.count} times`);
// })
 
// app.get("/test",(req,res)=>{
//     res.send("This is a test route");
// })


app.get("")
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})