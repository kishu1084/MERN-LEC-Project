const mongoose = require('mongoose');

const EventInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle: { type: String },
  status: {type: String, default: "Pending"},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventInquiry', EventInquirySchema);
