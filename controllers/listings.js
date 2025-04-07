const Listing = require("../models/listing.js");
const Booking = require("../models/booking");


module.exports.index = async (req, res) => {
  const { q } = req.query;

  let listings;
  if (q) {
    const regex = new RegExp(q, "i"); // 'i' = case insensitive
    listings = await Listing.find({ title: regex }); // you can also search in 'location' or 'description'
  } else {
    listings = await Listing.find({});
  }

  res.render("listings/index", { allListings: listings, q });
};

module.exports.renderNewForm  = (req, res) => {
    res.render("listings/new.ejs");
  }

module.exports.showListing= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { currentUser: req.user, listing });
  }
  

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success", "New Listing Create");
    // res.redirect(`/listings/${_id}`);
    res.redirect(`/listings/${newListing._id}`);
  }

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }

  module.exports.updateListing= async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();

    }
    
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
  }


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
  }



  module.exports.analyticsPage = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
  
    const bookings = await Booking.find({ listing: id });
  
    let totalGuests = 0;
    let totalDays = 0;
  
    bookings.forEach(booking => {
      totalGuests += booking.guests;
      totalDays += booking.days;
    });
  
    res.render("listings/analytics", {
      listing,
      bookings,
      totalBookings: bookings.length,
      totalGuests,
      totalDays
    });
  };
  