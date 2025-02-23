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
} = require('../controller/UserController');

const admin = require('./Admin');

// User Routes
router.post('/register', register);
router.post('/login', login);
router.post('/adminlogin', adminlogin);
router.post('/verify-token', verifytoken);
router.use('/admin', admin);
router.post('/verify-tokenadmin', verifytokenadmin);
router.post('/addtotalattendquation', addTotalAttendQuestion);
router.post('/viewuserprofile', viewUserProfile);
router.post('/forgetpassword', Forgetpassword);
router.post('/varifyOtp', VarifyOtp);
router.post('/resetpassword', ResetOtp);

module.exports = router;
