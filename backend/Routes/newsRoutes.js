const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const {createNews,feachAllNews,updateNewsById,deleteNewsById} = require('../Controllers/newsController');
const upload = require("./upload");

//to get all the news
router.get('/', feachAllNews);

//to create a news
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createNews);

//to update a news
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), updateNewsById);

//to delete a news
router.delete('/:id', deleteNewsById);

module.exports = router;