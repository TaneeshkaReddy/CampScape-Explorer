const campground=require('../models/campground');
const {cloudinary}=require("../cloudinary");

module.exports.index=async(req,res)=>{
  const campgrounds=await campground.find({});
  res.render('campgrounds/index',{campgrounds})
};

module.exports.renderNewForm=(req,res)=>{
  
  res.render('campgrounds/new');
};

module.exports.createCampground=async(req,res,next)=>{
  
  // res.send(req.body); to check

  // if(!req.body.campground) throw new ExpressError('Invalid data',400)
  // so here if error is encountered ,then it will throw an "ExpressError" and above wala catchAsync will catch it and hand it over to next()
  
  const camp=new campground(req.body.campground);
  camp.author=req.user._id;
  camp.images=req.files.map(f => ({url: f.path,filename:f.filename}));
  await camp.save();
  console.log(camp);
  req.flash('success',"Successfully made a campground");
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground=async(req,res)=>{
 
  const camp=await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author'); 
  //Without populate, the reviews field in the camp document would just be an array of ObjectIds referencing Review documents.
  //With populate, those ObjectIds are replaced with the actual Review documents, providing full details about each review.
  console.log(camp);
  if (!camp) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
}
  
    res.render('campgrounds/show',{camp});
 
}


module.exports.renderEditForm=async(req,res)=>{
  const {id}=req.params;
  const camp=await campground.findById(id);
  if (!camp) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
   }

   
  res.render('campgrounds/edit',{camp})
}


module.exports.updateCampground=async(req,res)=>{
  // res.send("it worked");
  // res.send(req.body);
  const {id}=req.params;
  console.log(req.body);
  const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
  const addedimages=req.files.map(f => ({url: f.path,filename:f.filename}));
  editedcamp.images.push(...addedimages);
  await editedcamp.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    
  }
    await editedcamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
  }
  console.log(editedcamp);
  req.flash('success','Successfully updated campground');
  res.redirect(`/campgrounds/${editedcamp._id}`)
}


module.exports.deleteCampground=async(req,res)=>{
  const {id}=req.params;
  
  await campground.findByIdAndDelete(id);
  req.flash('success','Successfully deleted campground');
  res.redirect('/campgrounds');
}