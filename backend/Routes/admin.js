const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middlewares/authMiddleware");
const User = require("../Models/User");

// ✅ Get all users (Admin only)
router.get("/users", adminProtect, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Delete a user (Admin only)
router.delete("/user/:id", adminProtect, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
