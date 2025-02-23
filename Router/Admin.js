const express = require('express');
const {
  addCourse,
  delateCourse,
  addSubject,
  addCoSubject,
  addQuestion,
  getCourses,
  getSubject,
  getCoSubject,
  getQuestions,
} = require('../controller/CrouseController');
const upload = require('../Models/upload');

const router = express.Router();

router.post('/add-course', upload.single('image'), addCourse);
router.delete('/delate-course/:id', delateCourse);
router.post('/addsubject/:courseId', addSubject);
router.get('/subject/:courseId', getSubject);
router.get('/cosubject/:courseId/:subjectId', getCoSubject);
router.get('/quations/:courseId/:subjectId/:coSubjectId', getQuestions);
router.post('/addcosubject/:courseId/:subjectId', addCoSubject);
router.post('/addquestion', addQuestion);
router.get('/course', getCourses);

module.exports = router;
