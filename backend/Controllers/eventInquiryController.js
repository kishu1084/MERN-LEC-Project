const EventInquiry = require('../Models/EventInquiry');
const RegisterStudent = require('../Models/EventRegisterStudent'); // RegisterStudent model
const Student = require("../Models/User");
// CREATE
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, eventId, eventTitle } = req.body;
    const existingInquiry = await EventInquiry.findOne({ email, eventId });

    if (existingInquiry) {
      return res.status(409).json({ message: 'You have already submitted an inquiry for this event.' });
    }
    const inquiry = new EventInquiry({
      name,
      email,
      phone,
      eventId,
      eventTitle
    });

    await inquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not submit inquiry.' });
  }
};

// FETCH ALL
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await EventInquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not fetch inquiries.' });
  }
};

// UPDATE
exports.updateInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const updatedData = req.body;

    // Check if status is being updated to "Registered"
    if (updatedData.status === 'Registered') {
      updatedData.registrationDate = Date.now(); // Set the registration date when registering
    }

    const updatedInquiry = await EventInquiry.findByIdAndUpdate(
      inquiryId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    if (updatedData.status === 'Registered') {
      const eventId = updatedInquiry.eventId;
      const student = await Student.findOne({ email: updatedInquiry.email });

      if (!student) {
        return res.status(404).json({ message: 'Student not found to register.' });
      }

      // Check if the student already has a RegisterStudent record
      let registerStudent = await RegisterStudent.findOne({ studentId: student._id });

      if (registerStudent) {
        // Check if already registered for the event
        const alreadyRegistered = registerStudent.eventDetails.some(detail => detail.eventId.toString() === eventId.toString());

        if (alreadyRegistered) {
          return res.status(400).json({ message: 'Student already registered for this event.' });
        }

        // Add the new eventId to the eventDetails array
        registerStudent.eventDetails.push({
          eventId,
          status: 'registered',
          paymentStatus: 'pending',
          fees: 1000,
        });
        await registerStudent.save();
      } else {
        // No registration yet, create a new one
        registerStudent = new RegisterStudent({
          studentId: student._id,
          eventDetails: [{
            eventId,
            status: 'registered',
            paymentStatus: 'pending',
            fees: 1000,
          }],
        });

        await registerStudent.save();
      }
    }

    res.status(200).json({ message: 'Inquiry updated successfully and student registered.', updatedInquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not update inquiry.' });
  }
};




// DELETE
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.id;

    const deletedInquiry = await EventInquiry.findByIdAndDelete(inquiryId);

    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not delete inquiry.' });
  }
};
