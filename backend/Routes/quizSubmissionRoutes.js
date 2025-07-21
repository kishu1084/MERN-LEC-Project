const express = require('express');
const router = express.Router();
const { submitQuiz, getAllQuizSubmissions,deleteMultipleQuizSubmissions, checkQuizAttempt } = require('../Controllers/quizSubmissionController');

router.get("/all", getAllQuizSubmissions);
router.post('/submit', submitQuiz);
router.delete("/bulk-delete", deleteMultipleQuizSubmissions);
router.get('/checkAttempt', checkQuizAttempt);
module.exports = router;
