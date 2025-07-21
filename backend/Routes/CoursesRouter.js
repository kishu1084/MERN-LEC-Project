const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const { createCourses, feachAllCourses, updateCourseById, deleteCourseById } = require('../Controllers/CoursesController');
const upload = require("./upload");


//to get all the courses
router.get('/', feachAllCourses);

//to create a course
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), createCourses);

//to update a course
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updateCourseById);

//to delete a course
router.delete('/:id', deleteCourseById);

module.exports = router;