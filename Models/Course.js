const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Multiple options
  correctOption: { type: String, required: true }, // Correct answer
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
});

// Course Schema (Main category for subjects)
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  subjects: [subjectSchema], // Array of subjects
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
