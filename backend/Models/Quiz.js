const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  options: [String],
  answer: String,
  marks: Number,
});

const quizSchema = new mongoose.Schema({
  title: String,
  course: String,
  password: String,
  qBank: [questionSchema],
  status: {
    type: String,
    enum: ["Active","InActive"],
    default: "Active" 
   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
