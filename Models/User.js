const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    unique: true,
    required: true,
  },
  referredBy: {
    type: String, // Store the referrer's email or referral code
    default: null,
  },
  referralCount: {
    type: Number,
    default: 0, // Number of successful referrals
  },
  totalAttendedQuestions: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
