const mongoose = require('mongoose');
const EnrollmentRequest = require("../Models/CourseRequest"); // Make sure this is correct
const Student = require("../Models/EnrolledStudent");
const CourseModel = require("../Models/CoursesModel");

// @desc    Submit new enrollment
// @route   POST /api/enrollment
exports.submitEnrollment = async (req, res) => {
  try {
    const { name, email, phone, courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId" });
    }

    const newRequest = new EnrollmentRequest({ name, email, phone, courseId });
    await newRequest.save();

    res.status(201).json({ success: true, message: "Enrollment saved successfully." });
  } catch (error) {
    console.error("Enrollment submission error:", error);
    res.status(500).json({ success: false, message: "Server error while saving enrollment." });
  }
};


// @desc    Get all enrollments (for admin) with aggregation
// @route   GET /api/enrollment
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrollmentRequest.aggregate([
      {
        $group: {
          _id: "$email",
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          email: { $first: "$email" },
          requests: { $push: "$$ROOT" },
          overallStatus: {
            $min: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", "Pending"] }, then: 1 },
                  { case: { $eq: ["$status", "Approved"] }, then: 2 },
                  { case: { $eq: ["$status", "Rejected"] }, then: 3 }
                ],
                default: 99
              }
            }
          }
        }
      },
      {
        $addFields: {
          overallStatus: {
            $switch: {
              branches: [
                { case: { $eq: ["$overallStatus", 1] }, then: "Pending" },
                { case: { $eq: ["$overallStatus", 2] }, then: "Approved" },
                { case: { $eq: ["$overallStatus", 3] }, then: "Rejected" }
              ],
              default: "Unknown"
            }
          }
        }
      }
    ]);

    res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch enrollments." });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const deletedEnrollment = await EnrollmentRequest.findByIdAndDelete(req.params.id);
    if (!deletedEnrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, message: "Course Request deleted successfully", data: deletedEnrollment });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
};


// @desc    Update status of a student enrollment
// @route   PUT /api/enrollment/:id/status
exports.updateEnrollmentStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const updatedRequest = await EnrollmentRequest.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // ✅ If status is Approved, add the course to student's enrolledCourses
    if (status === "Approved") {
      const { email, courseId } = updatedRequest; // Make sure courseId is stored in the request

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      const customDuration = course.duration || "1 week"; // Default duration if not found
      const customFees = course.fee || 2000; // Default fee if not found

      const updatedStudent = await Student.findOneAndUpdate(
        
        { email },
        {
          $addToSet: {
            enrolledCourses: {
              courseId: courseId, // this should be an ObjectId from the Course collection
              customDuration, // Add the customDuration
              customFees,// optionally add customDuration and customFees here
            }
          }
        },
        { new: true }
      );


      if (!updatedStudent) {
        return res.status(404).json({ success: false, message: "Student not found to update enrollment" });
      }
    }

    res.json({ success: true, data: updatedRequest });
  } catch (err) {
    console.error("Error updating enrollment status:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.checkEnrollmentStatus = async (req, res) => {
  const { email, courseId } = req.query;

  if (!email || !courseId) {
    return res.status(400).json({ success: false, message: "Missing email or courseId" });
  }

  try {
    const existingRequest = await EnrollmentRequest.findOne({
      email,
      courseId,
      status: "Pending"
    });

    if (existingRequest) {
      return res.json({ exists: true, message: "You have already requested this course and it's still pending." });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


