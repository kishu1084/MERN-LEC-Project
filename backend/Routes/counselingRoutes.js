const express = require("express");
const router = express.Router();
const { createInquiry, getAllInquiries, deleteInquiry, updateInquiryStatus, checkCounselingStatus } = require("../Controllers/counselingController");

// Submit a counseling inquiry
router.post("/", createInquiry);
router.get("/", getAllInquiries);  // ✅ Fetch all inquiries
router.delete("/:id", deleteInquiry);  // ✅ Delete inquiry
router.put("/:id/status", updateInquiryStatus);  // ✅ Update status
router.get('/check', checkCounselingStatus);
module.exports = router;
