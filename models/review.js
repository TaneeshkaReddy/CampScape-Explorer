const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
  body:String,
  rating:Number
});
//just going one way for now and putting reference of camp in review model

module.exports=mongoose.model("Review",reviewSchema);