const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");



// ✅ Function to Generate a Random Password
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
};

// ✅ Email Sending Function

const sendEmail = async (to, subject, text) => {
    try {
        console.log(`📩 sendEmail() called for: ${to}`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SSM_LEC" <no-reply@yourdomain.com>`, // Use a business email
            to,
            subject,
            text,
            html: `<p>${text}</p>`, // Use HTML
        };

        console.log("📨 Sending email...");
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully: ${info.response}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};





// ✅ User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, googleId, role } = req.body;

        // Input validation
        if (!name || !email || (!password && !googleId && role !== "admin")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({
            message: "User already exists",
            success: false, 
        });

        let hashedPassword = null;
        let randomPassword = null;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else if (role === "admin") {
            randomPassword = generateRandomPassword();
            hashedPassword = await bcrypt.hash(randomPassword, 10);
            console.log(`✅ Admin created: ${email} | Password: ${randomPassword}`);

            // Send admin password via email
            await sendEmail(
                email,
                "Your Admin Account Password",
                `Hello ${name},\n\nYour admin account has been created.\nYour temporary password is: ${randomPassword}\nPlease change it after logging in.\n\nBest regards,\nSSM LEC Team`
            );
        }

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword, // Only store password if normal registration
            phone,
            googleId: googleId || null, // Store Google ID if provided
            role: role || "Visitor",
        });

        await user.save();

        
        res.status(201).json({
            message: "User registered successfully",
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error",
            success: true,
            error: err 
        });    
    }
};

// ✅ User Login

exports.login = async (req, res) => {
    try {
        const { email, password, googleId } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // If user logs in via Google, verify googleId
        if (googleId) {
            if (user.googleId !== googleId) {
                return res.status(400).json({ message: "Invalid Google Credentials" });
            }
        } else {
            // If normal login, verify password
            if (!password || !user.password || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
        }

        // Generate JWT token with role
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Store token in HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            maxAge: 3600000 // 1 hour
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Include role in response
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = { sendEmail };
