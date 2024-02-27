const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
// const joi=require('joi');
const {campgroundSchema,reviewSchema}=require('./joi_schemas.js');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');//for this first do npm i method-override,then this is used so that we can disguise put/patch requests as post requests ,so basically tricking express

const campground=require('./models/campground')//importing Campground model from campground.js
//so what i understood is that : in campground.js we exported the model so basically only what we export can be
//imported and used in another file (here app.js) 
const Review=require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/camp-scape')


//damn almost forgot about this part lolll
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
  console.log("Database connected");
});




const app=express();

//middleware
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));//without this line when we submit form , and if we used res.send(req.body) in app.post method , it will show empty body because, body won't be parsed.
app.use(methodOverride('_method'));

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


app.get('/',(req,res)=>{
  //  res.send("I AM WORKING yayyy");
  res.render('home');
})

app.get('/campgrounds',catchAsync(async(req,res)=>{
  const campgrounds=await campground.find({});
  res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new');
})

app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{
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

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
 
  const camp=await campground.findById(req.params.id).populate('reviews');
  
    res.render('campgrounds/show',{camp});
 
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
  const camp=await campground.findById(req.params.id);
  res.render('campgrounds/edit',{camp})
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
  // res.send("it worked");
  // res.send(req.body);
  const {id}=req.params;
  const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${editedcamp._id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
  const {id}=req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
  // res.send("you made it!!")
  const camp=await campground.findById(req.params.id);
  const review=new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res,next)=>{
  const {id,reviewId}=req.params;
  await campground.findByIdAndUpdate(id,{$pull :{reviews:reviewId}}); //this is gonna pull review with reviewId out of reviews array and update that campground
  await Review.findByIdAndDelete(reviewId);
  // res.send("delete me")
  res.redirect(`/campgrounds/${id}`);

}))

app.all('*',(req,res,next)=>{
  // res.send("404!!!")
  next(new ExpressError('Page Not Found',404))
})

//very basic error handler
app.use((err,req,res,next)=>{ // so here err will have "ExpressError('Page Not Found',404)" in it
  const {statusCode=500}=err; 
  res.status(statusCode).render('error',{err});
 
})


app.listen(3000,()=>{
  console.log('serving on port 3000')
}); 
