import mongoose from 'mongoose';


const UserSchema=new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true,
  }
 

},{timestamps: true});



export const User=new mongoose.Model(UserSchema);


