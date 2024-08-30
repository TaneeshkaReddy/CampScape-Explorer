const mongoose=require('mongoose');
const Schema=mongoose.Schema;// we have done this so that while creating actual model, we do not have to use mongoose.Schema everywhere and can just use Schema
const Review=require('./review')



const CampgroundSchema=new Schema({
  title:String,
  images: [
    {
      url:String,
      filename:String
    }
    
  ],
  price:Number,
  description:String,
  location:String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review'
    }
  ]
});
//trigger - query middleware

//after findByIdAndDeelete this middleware is automatically triggered: and so the deleted campground is still in access
CampgroundSchema.post('findOneAndDelete',async function(deleted_camp){
  // console.log(deleted_camp);

  if(deleted_camp){
    await Review.deleteMany({
      _id:{
        $in:deleted_camp.reviews
      }
    })
  }


})


//exporting model Campground by compiling model name: Campground and schema name : CampgroundSchema
module.exports=mongoose.model('Campground',CampgroundSchema);
//remember no quotes for CampgroundSchema for above statement, it caused an error
