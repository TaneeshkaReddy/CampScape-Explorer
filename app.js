const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');//for this first do npm i method-override,then this is used so that we can disguise put/patch requests as post requests ,so basically tricking express

const campground=require('./models/campground')//importing Campground model from campground.js
//so what i understood is that : in campground.js we exported the model so basically only what we export can be
//imported and used in another file (here app.js) 

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

app.get('/',(req,res)=>{
  //  res.send("I AM WORKING yayyy");
  res.render('home');
})

app.get('/campgrounds',async(req,res)=>{
  const campgrounds=await campground.find({});
  res.render('campgrounds/index',{campgrounds})
})
app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new');
})

app.post('/campgrounds',async(req,res)=>{
  // res.send(req.body); to check
  const camp=new campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
})

// app.get('/makecampground',async (req,res)=>{
//   const camp=new campground({title:'My Backyard',description:"Sasta camping"});
//   await camp.save();
//   res.send(camp);
//   // res.render('home');
// })

app.get('/campgrounds/:id',async(req,res)=>{
 
  const camp=await campground.findById(req.params.id);
    res.render('campgrounds/show',{ camp });
 
})

app.get('/campgrounds/:id/edit',async(req,res)=>{
  const camp=await campground.findById(req.params.id);
  res.render('campgrounds/edit',{camp})
})

app.put('/campgrounds/:id',async(req,res)=>{
  // res.send("it worked");
  // res.send(req.body);
  const {id}=req.params;
  const editedcamp=await campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${editedcamp._id}`)
})

app.delete('/campgrounds/:id',async(req,res)=>{
  const {id}=req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})



app.listen(3000,()=>{
  console.log('serving on port 3000')
});
