// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../Controllers/enrollmentController');

// POST: Student requests enrollment
router.post('/request', enrollmentController.requestEnrollment);

// GET: Admin views all requests
router.get('/all', enrollmentController.getAllEnrollmentRequests);

// PUT: Admin approves
router.put('/approve/:id', enrollmentController.approveEnrollment);

// PUT: Admin rejects
router.put('/reject/:id', enrollmentController.rejectEnrollment);

module.exports = router;
