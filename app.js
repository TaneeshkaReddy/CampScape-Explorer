const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
// const joi=require('joi');

const session=require('express-session')

const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');//for this first do npm i method-override,then this is used so that we can disguise put/patch requests as post requests ,so basically tricking express

const campground=require('./models/campground')//importing Campground model from campground.js
//so what i understood is that : in campground.js we exported the model so basically only what we export can be
//imported and used in another file (here app.js) 
const Review=require('./models/review');

//requiring routes
const campgrounds=require('./routes/campgrounds.js');
const reviews=require('./routes/reviews.js');

const flash=require('connect-flash');

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

app.use(express.static(path.join(__dirname,'public')))

//cookie setup
const sessionConfig={
  secret:'thisisasecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+(1000*60*60*24*7),
    maxAge:1000*60*60*24*7,
    HttpOnly:true
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('errror');
  next();
})

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
// so for all routes in campgrounds and reviews wale routes will be appended by doing the above

app.get('/',(req,res)=>{
  //  res.send("I AM WORKING yayyy");
  res.render('home');
})



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
