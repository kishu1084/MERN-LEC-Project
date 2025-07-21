const express = require("express");
const router = express.Router();
const {
  submitEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
  checkEnrollmentStatus,
} = require("../Controllers/courseEnrollmentController");

// Route to handle form submission
router.post("/", submitEnrollment);

// Route to get all enrollments (admin panel)
router.get("/", getAllEnrollments);

// Route to update the status of an enrollment
router.put('/:id/status', updateEnrollmentStatus);

router.delete("/:id", deleteEnrollment);

// GET /api/courseEnrollment/check?email=...&courseId=...
router.get('/check', checkEnrollmentStatus);


// Add routes for update/delete as needed

module.exports = router;
