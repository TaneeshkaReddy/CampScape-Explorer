const express=require('express');
const router=express.Router({mergeParams:true});

const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');

const campground=require('../models/campground');
const Review=require('../models/review');

const {campgroundSchema,reviewSchema}=require('../joi_schemas.js');

const validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
  throw new ExpressError(msg,400)
}else{
  next();
}
console.log(res);
}


router.post('/',validateReview,catchAsync(async(req,res)=>{
  // res.send("you made it!!")
  const camp=await campground.findById(req.params.id);
  const review=new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
  const {id,reviewId}=req.params;
  await campground.findByIdAndUpdate(id,{$pull :{reviews:reviewId}}); //this is gonna pull review with reviewId out of reviews array and update that campground
  await Review.findByIdAndDelete(reviewId);
  // res.send("delete me")
  res.redirect(`/campgrounds/${id}`);

}))
module.exports=router;