const CounselingInquiry = require("../Models/CounselingInquiry");
const EnrolledStudent = require("../Models/EnrolledStudent");

// Submit a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const inquiry = new CounselingInquiry(req.body);
    await inquiry.save();
    res.status(201).json({ success: true, message: "Inquiry submitted successfully!", inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit inquiry", error });
  }
};

// Get all inquiries (for admin panel)
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await CounselingInquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch inquiries", error });
  }
};

// ✅ Fetch all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await CounselingInquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch inquiries" });
    }
};

// ✅ Delete an inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        await CounselingInquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete inquiry" });
    }
};

// ✅ Update inquiry status

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Update the inquiry status
    const inquiry = await CounselingInquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    // Move to EnrolledStudent if status is "Enrolled"
    if (status === "Enrolled") {
      const alreadyEnrolled = await EnrolledStudent.findOne({ email: inquiry.email });

      if (!alreadyEnrolled) {
        const enrolledStudent = new EnrolledStudent({
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
        });
        await enrolledStudent.save();
      }
    }

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update inquiry status" });
  }
};

exports.checkCounselingStatus = async (req, res) => {
  const { email } = req.query;

  if ( !email ) {
    return res.status(400).json({ success: false, message: "Missing email" });
  }

  try {
    const existingRequest = await CounselingInquiry.findOne({
          email,
          status: "Pending"
        });
    
        if (existingRequest) {
          return res.json({ exists: true, message: "You have already requested for Counsilling and it's still pending." });
        }
    
        return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking Counselling Request:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}