require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db"); // Database connection
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const User = require("./Models/User");
const { sendEmail } = require("./Controllers/authController");

const quizRoutes = require('./Routes/quizRoutes');
const authRoutes = require("./Routes/auth");
const adminRoutes = require("./Routes/admin");
const faqRoutes = require('./Routes/faqRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const newsRoutes = require('./Routes/newsRoutes');
const counselingRoutes = require("./Routes/counselingRoutes");
const CoursesRouter = require('./Routes/CoursesRouter');
const quizSubmissionRoutes = require('./Routes/quizSubmissionRoutes');
const enrollmentRoutes = require('./Routes/enrollmentRoutes');
const enrolledstudentRoutes = require('./Routes/enrolledstuentRoutes');
const courseEnrollmentRoutes = require("./Routes/courseEnrollmentRoutes");
const associatedCompanyRoutes = require('./Routes/associatedCompanyRoutes');
const trainerRoutes = require('./Routes/trainerRoutes');
const eventInquiryRoutes = require('./Routes/eventInquiryRoutes');
const registerStudentRoutes = require('./Routes/registerStudentRoutes');
const testimonialRoutes = require('./Routes/TestimonialRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const emailRoutes = require("./Routes/emailRoutes");

// ✅ Connect to MongoDB first
connectDB().then(() => {
    createAdminUser();
});

// ✅ Function to Generate a Random Password
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
};

// ✅ Ensure Admin User is Created After MongoDB Connection
const createAdminUser = async () => {
    try {
        console.log("🔍 Checking if admin exists...");
        const adminExists = await User.findOne({ role: "admin" });

        if (!adminExists) {
            console.log("✅ Admin does not exist, creating new admin...");

            const randomPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const admin = new User({
                name: "Admin",
                email: "patelkrishna01062003@gmail.com",
                password: hashedPassword,
                role: "admin",
                isAdmin: 1,
            });

            await admin.save();
            console.log(`✅ Admin Created: patelkrishna01062003@gmail.com | Password: ${randomPassword}`);

            // Attempt to send email
            console.log("📩 Attempting to send email...");
            await sendEmail(
                "patelkrishna01062003@gmail.com",
                "Your Admin Account Password",
                `Hello Admin,\n\nYour admin account has been created.\nYour temporary password is: ${randomPassword}\nPlease change it after logging in.\n\nBest regards,\nSSM LEC Team`
            );
            console.log("✅ Admin email sent successfully!");
        } else {
            console.log("✅ Admin already exists, no email sent.");
        }
    } catch (error) {
        console.error("❌ Error creating admin:", error);
    }
};

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Express Session (Needed for OAuth)
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Serve uploaded files statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));
// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', CoursesRouter);
app.use('/api/quiz', quizRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use("/api/counseling", counselingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoutes);
app.use('/api/quizSubmission', quizSubmissionRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/enrolledstudents', enrolledstudentRoutes);
app.use("/api/courseEnrollment", courseEnrollmentRoutes);
app.use('/api/companies', associatedCompanyRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/event-inquiries', eventInquiryRoutes);
app.use('/api/eventregisterstudents', registerStudentRoutes);
app.use('/api/testimonial', testimonialRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Hello from the server');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT: ${PORT}`);
});
