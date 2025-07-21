const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: Number,
  correctCount: Number,
  total: Number,
  tabSwitchCount: Number,
  submittedAnswers: Object,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);
