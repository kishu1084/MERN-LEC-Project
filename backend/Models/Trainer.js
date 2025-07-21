const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // Store image URL or path
  designation: { type: String, required: true },
  quickIntro: { type: String, required: true },
  linkedIn: { type: String }, // LinkedIn profile URL
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
