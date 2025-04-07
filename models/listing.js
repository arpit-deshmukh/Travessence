const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
  },

  price: String,
  location: String,
  country: String,

  availability: String,       // ✅ New
  priceSummary: String,       // ✅ New
  contact: String,            // ✅ New

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Cascade delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
