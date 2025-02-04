const express = require('express');
const {
  addCourse,
  addSubject,
  addCoSubject,
  addQuestion,
  getCourses,
  getSubject,
  getCoSubject,
  getQuation,
} = require('../controller/CrouseController');

const router = express.Router();

router.post('/add-course', addCourse);
router.post('/addsubject/:courseId', addSubject);
router.get('/subject/:courseId', getSubject);
router.get('/cosubject/:courseId/:subjectId', getCoSubject);
router.get('/quations/:courseId/:subjectId/:coSubjectId', getQuation);
router.post('/addcosubject/:courseId/:subjectId', addCoSubject);
router.post('/addquestion/:courseId/:subjectId/:coSubjectId', addQuestion);
router.get('/courses', getCourses);

module.exports = router;
