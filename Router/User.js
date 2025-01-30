const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminlogin,
  verifytoken,
  verifytokenadmin,
} = require('../controller/UserController');
const { addCourseQ, getCourse } = require('../controller/CrouseController');

const admin = require('./Admin');

// User Routes
router.post('/register', register);
router.post('/login', login);
router.post('/adminlogin', adminlogin);
router.post('/verify-token', verifytoken);
router.use('/admin', admin);
router.post('/verify-tokenadmin', verifytokenadmin);

// Course Routes
router.post('/course/:id/add-question', addCourseQ); // Renamed couse to course
router.get('/course/:id', getCourse); // Renamed couse to course

module.exports = router;
