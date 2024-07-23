const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
  res.render('users/register');
  }


module.exports.register=async(req,res)=>{
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
}


module.exports.renderLogin=(req,res)=>{
  res.render('users/login');
}


module.exports.login=(req,res)=>{
  req.flash('success','welcome back!');
  // res.redirect('/campgrounds');
  const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
  delete req.session.returnTo;
  res.redirect(redirectUrl);


}


module.exports.logout=(req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/campgrounds');
  });
}