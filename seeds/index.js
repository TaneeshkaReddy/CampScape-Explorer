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
  for(let i=0;i<5;i++){
    const random1000=Math.floor(Math.random()*1000);
    const price=Math.floor(Math.random()*2000)+10;
    const camp=new campground({
      author:'668d284789622de97d9351b8',
      location:`${cities[random1000].city},${cities[random1000].state}`,
      title:`${sample(descriptors)} ${sample(places)}`,
      // image: 'https://source.unsplash.com/collection/483251',
      // here using unsplash website ka collection, everytime we use above url, we will get a different image
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies porta mauris, sit amet semper ipsum pretium in. Quisque ut sem ultrices, porta sem ac, blandit mi. Aliquam erat volutpat. Integer ut commodo quam. Mauris vel nibh ut elit imperdiet venenatis. Integer mollis ullamcorper nunc, non suscipit quam cursus a. In hendrerit dui eros, nec sagittis dolor faucibus sed. Nullam ac orci non diam venenatis dignissim vitae ut augue. Etiam volutpat nunc sit amet egestas fermentum',
      price,
      images:[
        {
          url: 'https://res.cloudinary.com/dj3b1u10d/image/upload/v1725037613/YelpCamp/wlmb7ivbruhspjsf0ch0.jpg',
          filename: 'YelpCamp/wlmb7ivbruhspjsf0ch0'
        },
        {
          url: 'https://res.cloudinary.com/dj3b1u10d/image/upload/v1725037613/YelpCamp/zepio3jq4fconi7l5xok.jpg',
          filename: 'YelpCamp/zepio3jq4fconi7l5xok'
        }
      ]
    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})