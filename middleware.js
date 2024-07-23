const {campgroundSchema,reviewSchema}=require('./joi_schemas.js');
const ExpressError=require('./utils/ExpressError');
const campground=require('./models/campground');
const Review=require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
  console.log("REQ.USER.....",req.user);//session is going to store the serialized user and passport is going to desearialize it and store the data in req.user
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error','You must be signed in first');
    return res.redirect('/login');
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//joi middleware, not using it in app.use cuz we need this only for selective routes and not for every route
module.exports.validateCampground=(req,res,next)=>{
  // const result=campgroundSchema.validate(req.body);
   const {error} =campgroundSchema.validate(req.body); //.validate is inbuilt func of joi
   // if(result.error){
     if(error){
       const msg=error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg,400)
   }else{
     next();
   }
   
 }

 module.exports.verifyAuthor = async(req,res,next)=>{
  const {id}=req.params;
  const camp=await campground.findById(id);
  if(!camp.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
 }
 

 module.exports.validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body); //.validate is an inbuilt func of joi
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
  throw new ExpressError(msg,400)
}else{
  next();
}
}

module.exports.verifyReviewAuthor = async(req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do that');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
 }