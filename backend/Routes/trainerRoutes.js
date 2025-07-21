// const express = require('express');
// const router = express.Router();
// const trainerController = require('../Controllers/trainerController');

// router.post('/upload', trainerController.createTrainer);
// router.get('/all', trainerController.getAllTrainers);
// router.put('/:id', trainerController.updateTrainer);
// router.delete('/:id', trainerController.deleteTrainer);

// module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const trainerController = require('../Controllers/trainerController');

// Set upload path for trainers
const setTrainerUploadPath = (req, res, next) => {
  req.uploadPath = 'uploads/trainers';
  next();
};

router.post('/upload', setTrainerUploadPath, upload.single('image'), trainerController.createTrainer);
router.put('/:id', setTrainerUploadPath, upload.single('image'), trainerController.updateTrainer);
router.get('/all', trainerController.getAllTrainers);
router.delete('/:id', trainerController.deleteTrainer);

module.exports = router;

