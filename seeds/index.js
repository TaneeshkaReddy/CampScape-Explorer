//running this file seperate from node app , anytime we wanna see just the database

const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelpers');
const campground=require('../models/campground')//importing Campground model from campground.js
//so what i understood is that : in campground.js we exported the model so basically only what we export can be
//imported and used in another file (here app.js) 

mongoose.connect('mongodb://127.0.0.1:27017/camp-scape')


//damn almost forgot about this part lolll
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
  console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];



const seedDB=async()=>{
  await campground.deleteMany({});
  for(let i=0;i<50;i++){
    const random1000=Math.floor(Math.random()*1000);
    const camp=new campground({
      location:`${cities[random1000].city},${cities[random1000].state}`,
      title:`${sample(descriptors)} ${sample(places)}`
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})