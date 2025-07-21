const Trainer = require('../Models/Trainer');

// CREATE Trainer
exports.createTrainer = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/trainers/${req.file.filename}` : '';
    const newTrainer = new Trainer({
      ...req.body,
      image: imagePath,
    });

    await newTrainer.save();
    res.status(201).json({ message: 'Trainer created successfully', trainer: newTrainer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all Trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Trainer
exports.updateTrainer = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/trainers/${req.file.filename}` : undefined;

    const updateData = {
      ...req.body,
      ...(imagePath && { image: imagePath }), // only update image if a new one is uploaded
    };

    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Trainer updated', trainer: updatedTrainer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Trainer
exports.deleteTrainer = async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trainer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
