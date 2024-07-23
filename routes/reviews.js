const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const campground=require('../models/campground');
const Review=require('../models/review');
const {isLoggedIn,validateReview,verifyReviewAuthor}=require('../middleware');
const reviewsController=require('../controllers/reviews');





router.post('/',isLoggedIn,validateReview,catchAsync(reviewsController.createReview))

router.delete('/:reviewId',isLoggedIn,verifyReviewAuthor,catchAsync(reviewsController.deleteReview))
module.exports=router;