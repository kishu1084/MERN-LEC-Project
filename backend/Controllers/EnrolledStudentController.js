const EnrolledStudentSchema = require('../Models/EnrolledStudent');

const getAllEnrolledStudent = async (req, res) => {
    try {
        const students = await EnrolledStudentSchema.find().populate("enrolledCourses.courseId");
        res.status(200).json({ success: true, data: students });
    } catch (err) {
        console.error("Error fetching enrolled students:", err.message);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};


const updateEnrolledStudent = async (req, res) => {
    const { id } = req.params; // Extract the student ID from the URL params
    const updateFields = req.body; // Extract the fields to update from the request body

    try {
        // Find the student by ID and update with the new data
        const updatedStudent = await EnrolledStudentSchema.findByIdAndUpdate(id, updateFields, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation is applied
        });

        // Check if the student was found and updated
        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Send a success response with the updated student
        res.status(200).json({ success: true, data: updatedStudent });
    } catch (error) {
        // Handle any errors that occur during the update
        res.status(500).json({ success: false, message: "Error updating student", error: error.message });
    }
};

module.exports = {
    getAllEnrolledStudent,
    updateEnrolledStudent,
};