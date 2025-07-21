const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: { type: String },
    title: { type: String },
    image: { type: String },
    linkedIn: { type: String },
    content: { type: String },
    pripority: { type: String },
    designation: {type: String },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);