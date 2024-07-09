module.exports.isLoggedIn = (req,res,next)=>{
  console.log("REQ.USER.....",req.user);//session is going to store the serialized user and passport is going to desearialize it and store the data in req.user
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error','You must be signed in first');
    return res.redirect('/login');
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
};