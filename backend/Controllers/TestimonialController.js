const Testimonial = require('../Models/Testimonial');

exports.createTestimonial = async ( req, res ) => {
    try {
        const imagePath = req.file ? `/uploads/testimonials/${req.file.filename}` : '';
        const newTestimonial = new Testimonial({
            ...req.body,
            image: imagePath,
        });

        await newTestimonial.save();
        res.status(201).json({ message: 'Testimonial created successfully', testimonial: newTestimonial });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.find();
        res.status(200).json(testimonial);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/testimonials/${req.file.filename}` : undefined;

        const updateData = {
            ...req.body,
            ...(imagePath && { image: imagePath }),
        };

        const updateTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: 'Trainer Updated Successfully', testimonial: updateTestimonial});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTrainer = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Testimonial Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};