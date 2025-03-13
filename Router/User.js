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
const Event = require('./Event');

const User = require('../Models/User'); // Assuming you have a User model

// POST /user/deductreferrals
router.post('/deductreferrals', async (req, res) => {
  const { email, deductCount } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referrals < deductCount) {
      return res
        .status(400)
        .json({ message: 'Not enough referrals to deduct' });
    }

    // Deduct referrals
    user.referrals -= deductCount;
    await user.save();

    res.status(200).json({
      message: 'Referrals deducted successfully',
      referrals: user.referrals,
    });
  } catch (error) {
    console.error('Error deducting referrals:', error);
    res.status(500).json({ message: 'Failed to deduct referrals' });
  }
});

module.exports = router;

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

module.exports = router;
