const joi=require('joi');

module.exports.campgroundSchema=joi.object({  //basic joi schema for validating data even before saving it with mongoose
  campground: joi.object({
    title:joi.string().required(),
    price: joi.number().required().min(0),
    image:joi.string().required(),
    location:joi.string().required(),
    description:joi.string().required()
  }).required()

});

