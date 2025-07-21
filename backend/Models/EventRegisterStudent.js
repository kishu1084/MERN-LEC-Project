const mongoose = require('mongoose');

// Define the schema for RegisterStudent
const registerStudentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User or Student model
    required: true,
  },
  status: {
    type: String,
    default: "Active",
  },
  eventDetails: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Event model
        required: true,
      },
      status: {
        type: String,
        default: 'registered', // Registered, Pending, Completed, etc.
      },
      paymentStatus: {
        type: String,
        default: 'pending', // Payment statuses like 'pending', 'paid'
      },
      fees: {
        type: Number,
        default: 1000,
        required: true, // Include fees for each event
      },
      additionalInfo: {
        type: String,
        trim: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now, // Optional: To track when an event detail was last updated
      },
    }
  ],
  registrationDate: {
    type: Date, 
    // No default value, must be manually set when the student registers
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tracks when the student record was created
  },
});

const RegisterStudent = mongoose.model('EventRegisterStudent', registerStudentSchema);

module.exports = RegisterStudent;
