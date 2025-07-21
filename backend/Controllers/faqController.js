const FAQ = require('../Models/faqModel');

// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All FAQs with optional search/filter
exports.getAllFAQs = async (req, res) => {
  try {
    const { search = '', status } = req.query;
    const query = {
      $and: [
        {
          $or: [
            { question: new RegExp(search, 'i') },
            { answer: new RegExp(search, 'i') },
          ]
        },
        ...(status && status !== 'All' ? [{ status }] : [])
      ]
    };
    const faqs = await FAQ.find(query).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const updated = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle FAQ Status
exports.toggleFAQStatus = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    faq.status = faq.status === 'Active' ? 'Inactive' : 'Active';
    await faq.save();
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
