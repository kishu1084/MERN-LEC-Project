const mongoose = require('mongoose');

const CourseRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  courseId: mongoose.Schema.Types.ObjectId,
  courseName: String,
  courseType: String,
  courseDuration: String,
  courseFee: String,
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CourseRequest", CourseRequestSchema);
