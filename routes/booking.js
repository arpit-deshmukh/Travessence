const express = require("express");
const router = express.Router({ mergeParams: true }); // important to access :id
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// POST /bookings/:id
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const { name, phone, aadhar, address, guests, days } = req.body.booking;

  const newBooking = new Booking({
    listing: id,
    name,
    phone,
    aadhar,
    address,
    guests,
    days
  });

  await newBooking.save();
  req.flash("success", "Booking successful!");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
