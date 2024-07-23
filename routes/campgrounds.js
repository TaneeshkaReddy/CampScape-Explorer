const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const campground=require('../models/campground');
const {isLoggedIn,verifyAuthor,validateCampground}=require('../middleware');
const campgroundsController=require('../controllers/campgrounds');






router.get('/',catchAsync(campgroundsController.index)) //index is a method in a file called campgrounds in controllers folder 

router.get('/new',isLoggedIn,campgroundsController.renderNewForm)//this is a method in a file called campgrounds in controllers folder 


router.post('/',isLoggedIn,validateCampground,catchAsync(campgroundsController.createCampground))

// app.get('/makecampground',async (req,res)=>{
//   const camp=new campground({title:'My Backyard',description:"Sasta camping"});
//   await camp.save();
//   res.send(camp);
//   // res.render('home');
// })

router.get('/:id',catchAsync(campgroundsController.showCampground))

router.get('/:id/edit',isLoggedIn,verifyAuthor,catchAsync(campgroundsController.renderEditForm))

//METHOD 1 - this was before authorizing only author to send put and delete requests
// router.put('/:id',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
//   // res.send("it worked");
//   // res.send(req.body);
//   const {id}=req.params;
//   const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
//   req.flash('success','Successfully updated campground');
//   res.redirect(`/campgrounds/${editedcamp._id}`)
// }))

//METHOD 2 - dividing finding and updating to 2 parts
router.put('/:id',isLoggedIn,verifyAuthor,validateCampground,catchAsync(campgroundsController.updateCampground))

router.delete('/:id',isLoggedIn,verifyAuthor,catchAsync(campgroundsController.deleteCampground));

module.exports=router;