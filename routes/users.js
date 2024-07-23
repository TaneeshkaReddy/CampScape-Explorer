const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const { storeReturnTo } = require('../middleware');
const usersController=require('../controllers/users');


router.route('/register')
.get(usersController.renderRegister)
.post(catchAsync(usersController.register))

router.route('/login')
.get(usersController.renderLogin)
.post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),usersController.login)// use the storeReturnTo middleware to save the returnTo value from session to res.locals

router.get('/logout', usersController.logout); 


module.exports=router;