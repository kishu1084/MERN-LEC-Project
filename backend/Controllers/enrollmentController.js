// controllers/enrollmentController.js
const EnrollmentRequest = require('../Models/EnrollmentRequest');

// POST: Student requests enrollment
exports.requestEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const existing = await EnrollmentRequest.findOne({ studentId, courseId });
    if (existing) return res.status(400).json({ success: false, message: "Already requested." });

    const newRequest = new EnrollmentRequest({ studentId, courseId });
    await newRequest.save();
    res.status(201).json({ success: true, message: 'Request submitted', data: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET: Fetch all enrollment requests (Admin view)
exports.getAllEnrollmentRequests = async (req, res) => {
  try {
    const requests = await EnrollmentRequest.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'name');
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PUT: Admin approves a request
exports.approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EnrollmentRequest.findById(id);

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.status = 'approved';
    await request.save();

    // Optional: Insert into actual enrolled students collection here

    res.json({ success: true, message: 'Enrollment approved', data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT: Admin rejects a request
exports.rejectEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EnrollmentRequest.findById(id);

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ success: true, message: 'Enrollment rejected', data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
