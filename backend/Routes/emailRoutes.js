const express = require("express");
const router = express.Router();
const { sendEmail } = require("../Controllers/authController"); // Import email function

router.post("/send", async (req, res) => {
    try {
        const { to, subject, message } = req.body; // Get email data from frontend

        if (!to || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        await sendEmail(to, subject, message); // Call your existing function

        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

module.exports = router;
