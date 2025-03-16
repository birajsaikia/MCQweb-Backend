const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminlogin,
  verifytoken,
  addTotalAttendQuestion,
  viewUserProfile,
  verifytokenadmin,
  Forgetpassword,
  VarifyOtp,
  ResetOtp,
  Deductreferrals,
} = require('../controller/UserController');

const admin = require('./Admin');
const Event = require('./Event');

// User Routes
router.post('/register', register);
router.post('/login', login);
router.post('/adminlogin', adminlogin);
router.post('/verify-token', verifytoken);
router.use('/admin', admin);
router.use('/useevent', Event);
router.post('/verify-tokenadmin', verifytokenadmin);
router.post('/addtotalattendquation', addTotalAttendQuestion);
router.post('/viewuserprofile', viewUserProfile);
router.post('/forgetpassword', Forgetpassword);
router.post('/varifyOtp', VarifyOtp);
router.post('/resetpassword', ResetOtp);
router.post('/deductreferrals', Deductreferrals);

module.exports = router;
