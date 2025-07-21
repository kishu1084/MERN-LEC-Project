const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const testimonialController = require('../Controllers/TestimonialController');

const setTestimonialPath = (req, res, next) => {
    req.uploadPath = 'uploads/testimonials';
    next();
}

router.post('/', setTestimonialPath, upload.single('image'), testimonialController.createTestimonial);
router.put('/:id', setTestimonialPath, upload.single('image'), testimonialController.updateTestimonial);
router.get('/all',testimonialController.getAllTestimonial);
router.delete('/:id', testimonialController.deleteTrainer);

module.exports = router;