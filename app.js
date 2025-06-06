
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const Listing = require("./models/listing.js")
const path = require('path');
const methodOverride = require('method-override');

// const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError= require('./utils/ExpressError.js')
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const bookingRoutes = require("./routes/booking");



///auth
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//listing and review models and routes
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

//routes
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// databsase 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;




main().then(()=>{
    console.log("connected to DB")
}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

//views engine setup 
app.engine('ejs', ejsMate);
app.set("view engine",'ejs');
app.set('views',path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


//mongo-session
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})


//session options 
const sessionOptions = {
    store,
    
    secret:process.env.SECRET,
    resave :false,
    saveUninitialized :true,
    cookie:{
        //millisecond
        expires  : Date.now() + 7*24*60*60*1000 ,  
        maxAge : 7*24*60*60*1000 ,
        httplOnly :true,
        
    }
}


//root 
app.get('/',(req,res)=>{
    // res.send("heyy , this is HOMEPAGE");
    res.redirect("/listings");
});


//session and flash middleware use
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
  });

  
//passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using concept of flash and locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})


//routes applying
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/bookings", bookingRoutes);

//std response
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

// middleware 
app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
  // res.send("something went wrong");
})

// // port
// app.listen(8080,()=>{
//     console.log("server is listening");
// })

const PORT = process.env.PORT || 3000;

// console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
