const express = require("express");
const router = express.Router({mergeParams : true});


const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError= require('../utils/ExpressError.js')
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { createReview } = require("../controllers/reviews.js");

const reviewController = require("../controllers/reviews.js");

// Review form 
//post  Review route
router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
)

//Delete review route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview))


module.exports = router;