const campground=require('../models/campground');
const Review=require('../models/review');


module.exports.createReview=async(req,res)=>{
  // res.send("you made it!!")
  const camp=await campground.findById(req.params.id);
  const review=new Review(req.body.review);
  review.author=req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash('success','Successfully created a new review!');
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview=async(req,res,next)=>{
  const {id,reviewId}=req.params;
  await campground.findByIdAndUpdate(id,{$pull :{reviews:reviewId}}); //this is gonna pull review with reviewId out of reviews array and update that campground
  await Review.findByIdAndDelete(reviewId);
  // res.send("delete me")
  req.flash('success','Successfully deleted a review!');
  res.redirect(`/campgrounds/${id}`);

}