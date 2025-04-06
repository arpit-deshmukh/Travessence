const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path,"..",req.originalUrl);
  if (!req.isAuthenticated()) {
    //redirectUrl
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
    res.redirect("/login");
  }
  next();
};

//for saving in local
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


//for authorisation of user 
module.exports.isOwner =async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to make change in this listing");
    return res.redirect(`/listings/${id}`);
   
  } next();
}



//for authorisation of user for review
module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to make change in this review ");
    return res.redirect(`/listings/${id}`);
   
  } next();
}

//validation for listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //  console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validation for Review
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    //  console.log(result);
     if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }else{
      next();
     }
  
  }
  
