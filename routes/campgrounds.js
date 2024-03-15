const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const methodOverride=require('method-override');
const campground=require('../models/campground');
const {campgroundSchema,reviewSchema}=require('../joi_schemas.js');

//joi middleware, not using it in app.use cuz we need this only for selective routes and not for every route
const validateCampground=(req,res,next)=>{
  // const result=campgroundSchema.validate(req.body);
   const {error} =campgroundSchema.validate(req.body);
   // if(result.error){
     if(error){
       const msg=error.details.map(el=>el.message).join(',')
     throw new ExpressError(msg,400)
   }else{
     next();
   }
   console.log(res);
 }
 



router.get('/',catchAsync(async(req,res)=>{
  const campgrounds=await campground.find({});
  res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',(req,res)=>{
  res.render('campgrounds/new');
})

router.post('/',validateCampground,catchAsync(async(req,res,next)=>{
  // res.send(req.body); to check

  // if(!req.body.campground) throw new ExpressError('Invalid data',400)
  // so here if error is encountered ,then it will throw an "ExpressError" and above wala catchAsync will catch it and hand it over to next()

  const camp=new campground(req.body.campground);
  await camp.save();
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
  
    res.render('campgrounds/show',{camp});
 
}))

router.get('/:id/edit',catchAsync(async(req,res)=>{
  const camp=await campground.findById(req.params.id);
  res.render('campgrounds/edit',{camp})
}))

router.put('/:id',validateCampground,catchAsync(async(req,res)=>{
  // res.send("it worked");
  // res.send(req.body);
  const {id}=req.params;
  const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${editedcamp._id}`)
}))

router.delete('/:id',catchAsync(async(req,res)=>{
  const {id}=req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

module.exports=router;