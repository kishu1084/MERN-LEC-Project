// models/EnrolledStudent.js
const mongoose = require("mongoose");

const EnrolledStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: {type: String, required: true, default: "Active"},
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "coursesData" },
      customDuration: { type: String, default: "1 week" },  // or Number, depending on your format
      customFees: { type: Number, default: 2000 },
      status: { type: String, default: "Active"},
      installments: [
        {
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        }
      ]
    }
  ]
}, { timestamps: true }); 

module.exports = mongoose.model("EnrolledStudent", EnrolledStudentSchema);