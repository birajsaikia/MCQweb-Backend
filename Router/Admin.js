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
  deleteSubject,
  deleteCoSubject,
  deleteQuestion,
  addPreviousYearPaper,
  addPreviousYearQuestion,
  getPreviousYearPapers,
  getPreviousYearQuestions,
  deletePreviousYearPaper,
  deletePreviousYearQuestion,
} = require('../controller/CrouseController');
const upload = require('../Models/upload');

const router = express.Router();

router.post('/add-course', upload.single('image'), addCourse);
router.delete('/delate-course/:id', delateCourse);
router.post('/addsubject/:courseId', addSubject);
router.get('/subject/:courseId', getSubject);
router.delete('/subject/:courseId/:subjectId', deleteSubject);
router.get('/cosubject/:courseId/:subjectId', getCoSubject);
router.delete('/cosubject/:courseId/:subjectId/:coSubjectId', deleteCoSubject);
router.get('/quations/:courseId/:subjectId/:coSubjectId', getQuestions);
router.post('/addcosubject/:courseId/:subjectId', addCoSubject);
router.post('/addquestion', addQuestion);
router.get('/course', getCourses);
router.post('/addpreviousyearpaper/:courseId', addPreviousYearPaper);
router.post(
  '/addpreviousyearquestion/:courseId/:paperId',
  addPreviousYearQuestion
);
router.get('/getpreviousyearpapers/:courseId', getPreviousYearPapers);
router.get(
  '/getpreviousyearquestions/:courseId/:paperId',
  getPreviousYearQuestions
);
router.delete(
  '/quations/:courseId/:subjectId/:coSubjectId/:questionId',
  deleteQuestion
);

module.exports = router;
