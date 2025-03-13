const express = require('express');
const router = express.Router();
const {
  AddNotice,
  DelateNotice,
  GetNotice,
} = require('../controller/NoticeController'); // Import controllers

const upload = require('../Models/upload');

// Notice Routes

router.post('/notices/:courseId', AddNotice); // Add a notice to a course
router.delete('/notices/:courseId/:noticeId', DelateNotice); // Delete a notice from a course
router.get('/notices/:courseId', GetNotice); // Get all notices for a course

module.exports = router;
