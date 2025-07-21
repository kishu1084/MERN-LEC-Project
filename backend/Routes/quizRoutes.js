const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Quiz = require('../Models/Quiz');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload quiz JSON
const path = require('path');

router.post('/upload', upload.single('quizFile'), async (req, res) => {

  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Validate MIME type
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.json') {
      return res.status(400).json({ message: 'Only .json files are allowed' });
    }


    const fileData = fs.readFileSync(req.file.path, 'utf-8');
    const jsonData = JSON.parse(fileData);

    // Optional: delete file to keep folder clean
    fs.unlinkSync(req.file.path);

    if (!jsonData.qBank || !Array.isArray(jsonData.qBank)) {
      return res.status(400).json({ message: 'Invalid qBank' });
    }

    const newQuiz = new Quiz({
      title: req.body.title || jsonData.title || 'Uploaded Quiz',
      course: req.body.course || 'General',
      password: req.body.password || 30,
      qBank: jsonData.qBank,
      status: req.body.status || 'draft',
    });

    await newQuiz.save();
    res.status(200).json({ message: 'Quiz uploaded successfully!', data: newQuiz });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload quiz' });
  }
});


// Get all quizzes
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Update quiz by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz' });
  }
});

// Delete quiz by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});

// Get single quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});


module.exports = router;
