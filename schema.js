const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    availability: Joi.string().required(), // ✅ add this
    priceSummary: Joi.string().required(),      // ✅ add this
    contact: Joi.string().required(),      // ✅ add this
  }).required()
});
