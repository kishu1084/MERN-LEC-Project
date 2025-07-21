const QuizSubmission = require("../Models/quizSubmission");
const User = require("../Models/User");

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, score, correctCount, total, tabSwitchCount, submittedAnswers } = req.body;

    // Find user by email
    const user = await User.findOne({ email: userId }); // userId is email in frontend

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const submission = new QuizSubmission({
      quizId,
      userId: user._id, // Use MongoDB ObjectId
      score,
      correctCount,
      total,
      tabSwitchCount,
      submittedAnswers,
    });

    await submission.save();
    res.status(201).json({ message: "Quiz result submitted successfully" });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ message: "Submission failed", error: err });
  }
};

exports.getAllQuizSubmissions = async (req, res) => {
    try {
      const submissions = await QuizSubmission.find()
        .populate("userId", "name email")
        .populate("quizId", "title");
  
      res.status(200).json(submissions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch submissions", error: err });
    }
  };

  exports.deleteMultipleQuizSubmissions = async (req, res) => {
    try {
      const { ids } = req.body; // Expecting an array of submission IDs to delete
  
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "No IDs provided or invalid format" });
      }
  
      const result = await QuizSubmission.deleteMany({ _id: { $in: ids } });
  
      res.status(200).json({
        message: `${result.deletedCount} quiz submissions deleted successfully`,
      });
    } catch (err) {
      console.error("Bulk delete error:", err);
      res.status(500).json({ message: "Failed to delete quiz submissions", error: err });
    }
  };

  exports.checkQuizAttempt = async (req, res) => {
    const { quizId, userId } = req.query;
  
    try {
      const user = await User.findOne({ email: userId }); // userId is email
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const attempt = await QuizSubmission.findOne({ quizId, userId: user._id });
  
      if (attempt) {
        return res.json({ alreadyAttempted: true });
      } else {
        return res.json({ alreadyAttempted: false });
      }
    } catch (error) {
      console.error('Error checking attempt:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  