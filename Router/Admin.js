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
  getRandomMockTest,
} = require('../controller/CrouseController');
const {
  addMockTest,
  deleteMockTest,
  addMockTestQuestion,
  deleteMockTestQuestion,
  getmockTest,
  getMockTestQuestions,
} = require('../controller/mockTestController');
const upload = require('../Models/upload');
const notic = require('./notice');

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
router.get('/getrandommocktest/:courseId', getRandomMockTest);
router.get(
  '/getpreviousyearquestions/:courseId/:paperId',
  getPreviousYearQuestions
);
router.delete(
  '/deletepreviousyearpaper/:courseId/:paperId',
  deletePreviousYearPaper
);
router.delete(
  '/quations/:courseId/:subjectId/:coSubjectId/:questionId',
  deleteQuestion
);

router.post('/addmocktest/:courseId', addMockTest);
router.delete('/deletemocktest/:courseId/:mockTestId', deleteMockTest);

// ✅ Add/Delete Mock Test Questions
router.post('/addmocktestquestion/:courseId/:mockTestId', addMockTestQuestion);
router.delete(
  '/deletemocktestquestion/:courseId/:mockTestId/:questionId',
  deleteMockTestQuestion
);

// ✅ Get Mock Tests & Questions
router.get('/getmocktests/:courseId', getmockTest);
router.get('/getmocktestquestions/:courseId/:mockTestId', getMockTestQuestions);

router.use('/notice', notic);

module.exports = router;
