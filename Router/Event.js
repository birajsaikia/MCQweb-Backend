const express = require('express');
const router = express.Router();
const {
  addEvent,
  deleteEvent,
  getEvents,
  getEvent,
  addQuestion,
  deleteQuestion,
  getQuestions,
  submitEventAnswers,
} = require('../controller/Event'); // Import controllers
const upload = require('../Models/upload'); // Import multer for file uploads

// Event Routes
router.post('/events', upload.single('image'), addEvent); // Add a new event (with image upload)
router.delete('/events/:id', deleteEvent); // Delete an event by ID
router.get('/events', getEvents); // Get all events
router.get('/event/:eventId', getEvent); // Get all events

// Question Routes
router.post('/events/:eventId/questions', addQuestion); // Add a question to an event
router.delete('/events/:eventId/questions/:questionId', deleteQuestion); // Delete a question from an event
router.get('/events/:eventId/questions', getQuestions); // Get all questions for an event

router.post('/events/submit', submitEventAnswers); // Submit answers for an event

module.exports = router;
