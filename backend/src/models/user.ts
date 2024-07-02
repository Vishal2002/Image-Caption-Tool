import mongoose from 'mongoose';


const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true,
  },

  isDeleted:{
    type:Boolean,
    default:false
  },
  isVerified:{
    type:Boolean,
    default:false
  }
 

},{timestamps: true});



export const User=mongoose.model('User',UserSchema);


