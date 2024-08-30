const Joi=require('joi');
// Joi is a powerful schema description language and data validator for JavaScript.

module.exports.campgroundSchema=Joi.object({  //basic joi schema for validating data even before saving it with mongoose
  campground: Joi.object({
    title:Joi.string().required(),
    price: Joi.number().required().min(0),
    //image:Joi.string().required(),
    location:Joi.string().required(),
    description:Joi.string().required()
  }).required(),
  deleteImages:Joi.array()

});

module.exports.reviewSchema= Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    body:Joi.string().required()
  }).required()
})



