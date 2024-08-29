if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
//process.env.NODE_ENV is an environment variable that is usaully just production or development



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
const User=require('./models/user');

//requiring routes
const campgroundroutes=require('./routes/campgrounds.js');
const reviewroutes=require('./routes/reviews.js');
const userroutes=require('./routes/users.js');


const flash=require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// this line tells us hi passport, use localStrategy that was required and for that local strategy use and in-built method for authentication called User.authenticate()
passport.serializeUser(User.serializeUser()); //how to store data in a session
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{ 
  console.log(req.session);
  res.locals.currentUser=req.user; // so everywhere I will have access to the current logged in user just by using currentUser
  res.locals.success=req.flash('success');//same with succes and error, they will be visible to all routes
  res.locals.error=req.flash('error');
  next();
});

app.get('/fakeUser',async (req,res)=>{
  const user=new User({email:'tan@gmail.com',username:'tannn'})
  const newUser=await User.register(user,'mypassword')
  res.send(newUser);
})

app.use('/',userroutes);
app.use('/campgrounds',campgroundroutes)
app.use('/campgrounds/:id/reviews',reviewroutes)
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
