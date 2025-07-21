const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  updateInquiry,
  deleteInquiry
} = require('../Controllers/eventInquiryController');

router.post('/', createInquiry);
router.get('/', getAllInquiries);
router.put('/:id', updateInquiry);
router.delete('/:id', deleteInquiry);

module.exports = router;
