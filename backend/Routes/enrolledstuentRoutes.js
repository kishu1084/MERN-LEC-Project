const express = require('express');
const router = express.Router();
const {
    getAllEnrolledStudent,
    updateEnrolledStudent,
} = require('../Controllers/EnrolledStudentController');

router.get('/',getAllEnrolledStudent);
router.put('/:id',updateEnrolledStudent);

module.exports = router;