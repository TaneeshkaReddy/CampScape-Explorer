const mongoose=require('mongoose');
const Schema=mongoose.Schema;// we have done this so that while creating actual model, we do not have to use mongoose.Schema everywhere and can just use Schema

const CampgroundSchema=new Schema({
  title:String,
  price:String,
  description:String,
  location:String
});

//exporting model Campground by compiling model name: Campground and schema name : CampgroundSchema
module.exports=mongoose.model('Campground',CampgroundSchema);
//remeber no quotes for CampgroundSchema for above statement, it caused an error
