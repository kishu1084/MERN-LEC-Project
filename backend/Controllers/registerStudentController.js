const RegisterStudent = require('../Models/EventRegisterStudent');

// FETCH all students
exports.getAllRegisteredStudents = async (req, res) => {
  try {
    const students = await RegisterStudent.find()
      .populate('studentId', 'name email')
      .populate('eventDetails.eventId', 'title startDateTime trainerName'); // Ensure the schema is correctly defined

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// UPDATE event status for a student
exports.updateEventStatusForStudent = async (req, res) => {
  try {
    const { studentId, eventId } = req.params;
    const { status, paymentStatus, fees, trainerName } = req.body;

    const updatedStudent = await RegisterStudent.findOneAndUpdate(
      { studentId, 'eventDetails.eventId': eventId },
      {
        $set: {
          'eventDetails.$.status': status,
          'eventDetails.$.paymentStatus': paymentStatus,
          'eventDetails.$.fees': fees,
          'eventDetails.$.trainerName': trainerName,
          'eventDetails.$.updatedAt': Date.now(),  // Optional, if you want to track status updates
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student or Event not found.' });
    }

    res.status(200).json({ message: 'Event status updated successfully.', updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not update event status.' });
  }
};

// DELETE student registration (whole student document)
exports.deleteRegisteredStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await RegisterStudent.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not delete student.' });
  }
};

// DELETE a particular event for a student
exports.deleteParticularEventForStudent = async (req, res) => {
  try {
    const { studentId, eventId } = req.params;

    const updatedStudent = await RegisterStudent.findOneAndUpdate(
      { studentId }, // find student
      { $pull: { eventDetails: { eventId } } }, // pull (remove) the event from eventDetails
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found or Event not associated with this student.' });
    }

    res.status(200).json({ message: 'Event removed successfully for student.', updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not remove event.' });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const  status  = req.body;

    if (!status || !id) {
      return res.status(400).json({ message: "Status or Student ID is missing" });
    }

    const updateFields = { status };
    const updatedStudent = await RegisterStudent.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Student status updated successfully.', updatedStudent });
  } catch (error) {
    console.error("Error in updating student status:", error);
    res.status(500).json({ message: 'Server error. Could not update student status.' });
  }
};
