const CoursesModel = require("../Models/CoursesModel");


//Creating a new Course

const createCourses = async (req, res) => {
    try {

        // Extract form fields from request
        const { name, description, outcome, duration, fee, status, studentsEnrolled, type, subscription, } = req.body;

        // Extract file paths if uploaded
        const filePath = req.files['file'] ? req.files['file'][0].path : null;
        const imagePath = req.files['image'] ? req.files['image'][0].path : null;

        // Create Course Object
        const courseData = new CoursesModel({
            name,
            description,
            outcome,
            duration,
            fee,
            status,
            studentsEnrolled,
            image : imagePath,
            file: filePath,
            type,
            subscription,
        });

        // Save to database
        const savedCourse = await courseData.save();

        res.status(201).json({ 
            message: "Course is created", 
            success: true, 
            data: savedCourse 
        });

    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Internal Server Error", success: false, error: err.message });
    }
};


//Feaching all the Courses
const feachAllCourses = async(req, res) => {
    try{
        const data = await CoursesModel.find({});
        res.status(200)
            .json({message: 'All Courses', success: true, data});
    }catch(err){
        res.status(500).json({ message: 'Faialed to fatch  All Courses', success: false});
    }
}

//Updating the course
const updateCourseById = async(req, res) => {
    try{
        const id = req.params.id;
        const course = await CoursesModel.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found", success: false });
        }
        // Handle file uploads
        const image = req.files?.image ? req.files.image[0].path : course.image;
        const file = req.files?.file ? req.files.file[0].path : course.file;

        const updatedData = { ...req.body, image, file };

        await CoursesModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

        res.status(201)
            .json({message: 'Course updated', success: true });
    }catch(err){
        res.status(500).json({ message: 'Faialed to update a Course', success: false});
    }
}

//Deleting a course
const deleteCourseById = async(req, res) => {
    try{
        const id = req.params.id;
        await CoursesModel.findByIdAndDelete(id);
        res.status(201)
            .json({message: 'Courses Deleted', success: true});
    }catch(err){
        res.status(500).json({ message: 'Faialed to delete a Course', success: false});
    }
}

module.exports = {
    createCourses,
    feachAllCourses,
    updateCourseById,
    deleteCourseById
}