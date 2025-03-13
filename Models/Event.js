// const { time } = require('console');
const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true }, // ✅ Match frontend
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  time: { type: String, required: true },
  marks: { type: String, required: true },
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  time: { type: String, required: true },
  questions: [questionSchema], // Array of MCQ questions
  user: [userSchema],
});
module.exports = mongoose.model('Event', EventSchema);
