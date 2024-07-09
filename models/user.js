const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  }
});

UserSchema.plugin(passportLocalMongoose);// here Passport local mongoose will add a username , hash and salt field to store the username and hashed password and salt value
//it uses Pdkdf2 and not bcrypt
module.exports=mongoose.model('User',UserSchema)