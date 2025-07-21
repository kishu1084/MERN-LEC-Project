const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: {
    type: String,
    
    match: /^[0-9]{10}$/ // Optional: Add regex for validation
  },
  role: { type: String, enum: ["admin", "student","Visitor"], default: "Visitor" },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
