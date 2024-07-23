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
      image: 'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/254415687.jpg%3Fk%3D47ed904fa4d426dad09e67eac7a7544b37be6ceaa2baa7f5b98b3b54eb958f39%26o%3D%3Fs%3D375x210%26ar%3D16x9',

      // here using unsplash website ka collection, everytime we use above url, we will get a different image
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies porta mauris, sit amet semper ipsum pretium in. Quisque ut sem ultrices, porta sem ac, blandit mi. Aliquam erat volutpat. Integer ut commodo quam. Mauris vel nibh ut elit imperdiet venenatis. Integer mollis ullamcorper nunc, non suscipit quam cursus a. In hendrerit dui eros, nec sagittis dolor faucibus sed. Nullam ac orci non diam venenatis dignissim vitae ut augue. Etiam volutpat nunc sit amet egestas fermentum',
      price

    })
    await camp.save();
  }
}

seedDB().then(()=>{
  mongoose.connection.close();
})