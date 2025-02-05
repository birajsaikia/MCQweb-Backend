const express = require('express');
const {
  addCourse,
  addSubject,
  addCoSubject,
  addQuestion,
  getCourses,
  getSubject,
  getCoSubject,
  getQuestions,
} = require('../controller/CrouseController');

const router = express.Router();

router.post('/add-course', addCourse);
router.post('/addsubject/:courseId', addSubject);
router.get('/subject/:courseId', getSubject);
router.get('/cosubject/:courseId/:subjectId', getCoSubject);
router.get('/quations/:courseId/:subjectId/:coSubjectId', getQuestions);
router.post('/addcosubject/:courseId/:subjectId', addCoSubject);
router.post('/addquestion/:courseId/:subjectId/:coSubjectId', addQuestion);
router.get('/course', getCourses);

module.exports = router;
