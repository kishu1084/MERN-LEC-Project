const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, default: "" },
  category: { type: String, default: "" },
  tags: { type: String, default: "" },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["Published", "Draft"],
    default: "Draft"
  },
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

const NewsModel = mongoose.model('newsData', NewsSchema);
module.exports = NewsModel;
