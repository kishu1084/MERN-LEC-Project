const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const passport = require("passport");
const User = require("../Models/User");
const { sendEmail } = require("../Controllers/authController");
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email,phone, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword,phone });
    await user.save();

    await sendEmail(
      `${email}`,
      "Your Account Password",
      `Hello ${name},\n\nYour account has been created.\nYour temporary password is: ${password}\nPlease change it after logging in.\n\nBest regards,\nSSM LEC Team`
    )

    // await sendEmail(
    //                 "21se02ce033@ppsu.ac.in",
    //                 "Your Admin Account Password",
    //                 `Hello Admin,\n\nYour admin account has been created.\nYour temporary password is: ${randomPassword}\nPlease change it after logging in.\n\nBest regards,\nSSM LEC Team`
    //             );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // ✅ Include role in JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { name: user.name, email: user.email,phone:user.phone, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// // Google OAuth Routes
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/google/callback",
//   passport.authenticate("google", { failureRedirect: "/dashboard" }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`); // Redirect with token
//   }
// );

// Protected Route Example
router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to Dashboard" });
});

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/check-admin", async (req, res) => {
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
      res.json({ message: "Admin exists", admin });
  } else {
      res.json({ message: "No admin found" });
  }
});
module.exports = router;
