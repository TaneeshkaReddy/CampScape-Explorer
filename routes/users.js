const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const { storeReturnTo } = require('../middleware');
const usersController=require('../controllers/users');

router.get('/register',usersController.renderRegister)

router.post('/register',catchAsync(usersController.register));

router.get('/login',usersController.renderLogin);

// // use the storeReturnTo middleware to save the returnTo value from session to res.locals
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),usersController.login)

router.get('/logout', usersController.logout); 


module.exports=router;