const express = require('express');
const router = express.Router();
const registerStudentController = require('../Controllers/registerStudentController'); // Ensure the path is correct

// Fetch all registered students
router.get('/', registerStudentController.getAllRegisteredStudents);  // Ensure this is correct

// Update event status for a student
router.put('/update-status/:studentId/:eventId', registerStudentController.updateEventStatusForStudent);

router.put('/update-status/:id', registerStudentController.updateStudentStatus);

// Delete a registered student's record
router.delete('/:id', registerStudentController.deleteRegisteredStudent);
// Route for deleting particular event

router.delete('/:studentId/events/:eventId', registerStudentController.deleteParticularEventForStudent);

module.exports = router;
