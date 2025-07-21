const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // ✅ Use the middleware file
const {
  createCompany,
  getAllCompanies,
  deleteCompany,
  updateCompany
} = require('../Controllers/associatedCompanyController');

// Routes
router.post('/create', upload.single('logo'), createCompany);
router.get('/all', getAllCompanies);
router.delete('/:id', deleteCompany);
router.put('/:id', upload.single('logo'), updateCompany); // ✅ Fixed usage

module.exports = router;
