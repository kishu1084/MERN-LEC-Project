const mongoose = require('mongoose');

const AssociatedCompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      logo: {
        type: String,  // Store the filename of the uploaded logo
        required: false,
      },
}, { timestamps: true });

module.exports = mongoose.model('AssociatedCompany', AssociatedCompanySchema);
