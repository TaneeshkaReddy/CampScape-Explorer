const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const methodOverride=require('method-override');
const campground=require('../models/campground');
const {campgroundSchema,reviewSchema}=require('../joi_schemas.js');
const {isLoggedIn}=require('../middleware');

//joi middleware, not using it in app.use cuz we need this only for selective routes and not for every route
const validateCampground=(req,res,next)=>{
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
 



router.get('/',catchAsync(async(req,res)=>{
  const campgrounds=await campground.find({});
  res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn,(req,res)=>{
  
  res.render('campgrounds/new');
})


router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
  
  // res.send(req.body); to check

  // if(!req.body.campground) throw new ExpressError('Invalid data',400)
  // so here if error is encountered ,then it will throw an "ExpressError" and above wala catchAsync will catch it and hand it over to next()

  const camp=new campground(req.body.campground);
  await camp.save();
  req.flash('success',"Successfully made a campground");
  res.redirect(`/campgrounds/${camp._id}`);
}))

// app.get('/makecampground',async (req,res)=>{
//   const camp=new campground({title:'My Backyard',description:"Sasta camping"});
//   await camp.save();
//   res.send(camp);
//   // res.render('home');
// })

router.get('/:id',catchAsync(async(req,res)=>{
 
  const camp=await campground.findById(req.params.id).populate('reviews'); 
  //Without populate, the reviews field in the camp document would just be an array of ObjectIds referencing Review documents.
  //With populate, those ObjectIds are replaced with the actual Review documents, providing full details about each review.
  if (!camp) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
}
  
    res.render('campgrounds/show',{camp});
 
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res)=>{
  const camp=await campground.findById(req.params.id);
  if (!camp) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
}
  res.render('campgrounds/edit',{camp})
}))

router.put('/:id',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
  // res.send("it worked");
  // res.send(req.body);
  const {id}=req.params;
  const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
  req.flash('success','Successfully updated campground');
  res.redirect(`/campgrounds/${editedcamp._id}`)
}))

router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
  const {id}=req.params;
  await campground.findByIdAndDelete(id);
  req.flash('success','Successfully deleted campground');
  res.redirect('/campgrounds');
}))

module.exports=router;