const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple options
  correctOption: { type: String, required: true }, // Correct answer
});

// Previous Year Question Schema
const previousYearQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple options
  correctOption: { type: String, required: true }, // Correct answer
});
const mocktestQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple options
  correctOption: { type: String, required: true }, // Correct answer
});

// Previous Year Schema
const previousYearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  questions: [previousYearQuestionSchema], // Nested questions
});
const MocktestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  questions: [mocktestQuestionSchema], // Nested questions
});

// Co-Subject Schema (Sub-topic under a Subject)
const coSubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  myid: { type: String },
  questions: [questionSchema], // Array of MCQ questions
});

// Subject Schema (Main subject under a Course)
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coSubjects: [coSubjectSchema], // Nested co-subjects
  // Array of previous year questions
});
const noticeSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of notice
  description: { type: String, required: true }, // Notice description
  link: { type: String }, // External link if any
});

// Course Schema (Main category for subjects)
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  subjects: [subjectSchema],
  previousyears: [previousYearSchema],
  mockTest: { type: [MocktestSchema], default: [] }, // Ensure mockTest always exists
  notices: [noticeSchema],

  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
