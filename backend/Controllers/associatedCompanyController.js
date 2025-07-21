const Company = require('../Models/AssociatedCompany');

// Create
const fs = require('fs');
const path = require('path');

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const logo = req.file ? req.file.filename : null;

    const newCompany = new Company({
      name,
      logo,
    });

    await newCompany.save();

    res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (err) {
    res.status(500).json({ message: 'Error creating company', error: err.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ companies });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Remove the company logo from the filesystem
    if (company.logo) {
      fs.unlinkSync(path.join(__dirname, '../uploads/logos', company.logo));
    }

    await Company.findByIdAndDelete(companyId);
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting company', error: err.message });
  }
};

exports.updateCompany = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const logo = req.file?.filename;
  
    try {
      const company = await Company.findById(id);
      if (!company) return res.status(404).json({ message: 'Company not found' });
  
      // Optional: delete old logo from uploads folder
      if (logo && company.logo) {
        const oldLogoPath = path.join(__dirname, '../uploads/logos', company.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }
  
      if (name) company.name = name;
      if (logo) company.logo = logo;
  
      await company.save();
      res.status(200).json({ message: 'Company updated', company });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  