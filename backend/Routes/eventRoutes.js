const express = require('express');
const multer = require('multer');
const path = require('path');
const upload = require("./upload");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../Controllers/eventController');

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', upload.fields([{ name: 'banner', maxCount: 1 }]), createEvent);
router.put('/:id',  upload.fields([{ name: 'banner', maxCount: 1 }]), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
