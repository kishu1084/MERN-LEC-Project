// const Quiz = require('../models/Quiz');
const Quiz = require('../models/Quize');

exports.uploadQuiz = async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(req.file.path, 'utf-8'));

    const newQuiz = new Quiz({
      title: "Uploaded Quiz",
      questions: data.questions,
    });

    await newQuiz.save();

    res.status(200).json({ message: 'Quiz saved to MongoDB!', data: newQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload quiz' });
  }
};
