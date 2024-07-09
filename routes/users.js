const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register',(req,res)=>{
res.render('users/register');
})

router.post('/register',catchAsync(async(req,res)=>{
  // res.send(req.body);
  try{
  const {email,username,password} = req.body;
  const newUser= new User({email,username,password});
  const registered_user=await User.register(newUser,password);//instead of newUser.save()
  req.login(registered_user,err=>{
    if(err) return next(err);
      req.flash("success","Welcome to Yelp Camp");
      res.redirect('/campgrounds');
    
  })

  }catch(e){
    req.flash('error',e.message);
    res.redirect('register');
  }
  
 
}));

router.get('/login',(req,res)=>{
  res.render('users/login');
  
})

// // use the storeReturnTo middleware to save the returnTo value from session to res.locals
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
  req.flash('success','welcome back!');
  // res.redirect('/campgrounds');
  const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
  delete req.session.returnTo;
  res.redirect(redirectUrl);


})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/campgrounds');
  });
}); 


module.exports=router;