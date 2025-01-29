const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminlogin,
  verifytoken,
} = require('../controller/UserController');

router.post('/register', register);
router.post('/login', login);
router.post('/adminlogin', adminlogin);
router.post('/verify-token', verifytoken);

module.exports = router;
