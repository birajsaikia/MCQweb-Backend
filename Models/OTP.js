const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  createdAt : {
    type: Date,
    default: Date.now,
  },
  expiresAt : {
    default : Date.now() +5*60*100, 
  type:Date
 },
 email:{
  type:String,
  unique:true,
  required:true,
 }
});

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;
