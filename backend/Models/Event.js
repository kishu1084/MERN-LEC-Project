const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  location: String,
  eventType: String,
  trainerName: { type: String, default: 'Ms. Niyanta Desai'},
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  pinned: { type: Boolean, default: false },
  tags: String,
  banner: String, // filename or URL
  createdAt: { type: Date, default: Date.now },
  fee: {type: String, default: "500" },
  them: {type: String, default: "Light"},
});

module.exports = mongoose.model('Event', eventSchema);
