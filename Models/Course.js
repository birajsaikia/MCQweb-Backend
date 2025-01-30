const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOption: {
    type: String,
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema], // Array of questions for this course
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
