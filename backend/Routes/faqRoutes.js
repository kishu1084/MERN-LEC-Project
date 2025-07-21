const express = require('express');
const router = express.Router();
const {
  createFAQ,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
} = require('../Controllers/faqController');

router.post('/create', createFAQ);
router.get('/all', getAllFAQs);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.patch('/:id/toggle', toggleFAQStatus);

module.exports = router;
