const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cors = require('cors');
const CoursesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    outcome: { type: String, default: "" }, 
    duration: { type: String, default: "" }, 
    fee: { type: Number, default: 0 }, 
    status: {
       type: String,
       enum: ["Active","InActive"],
       default: "Active" 
      },
    studentsEnrolled:  { type: Number, default: 0 },
    image: { type: String }, 
    file: { type: String },
    type: { 
        type: String, 
        enum: ["Software", "Corporate"], 
        default: "Software" 
      },
      subscription: {
        type: String,
        enum: ["Premium","Free"],
        default: "Premium"
      }, 
}, { timestamps: true }
);

const CoursesModel = mongoose.model('coursesData',CoursesSchema);
module.exports = CoursesModel;