const mongoose = require("mongoose");

const CounselingInquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    contactStartTime: { type: String, required: true },
    contactEndTime: { type: String, required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Enrolled", "Not Interested"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("CounselingInquiry", CounselingInquirySchema);
