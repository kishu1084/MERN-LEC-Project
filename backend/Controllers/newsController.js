const NewsModel = require("../Models/newsModel");


//Creating a new News

const createNews = async (req, res) => {
    try {

        // Extract form fields from request
        const { title,content,date,category,tags,priority,status,pinned} = req.body;

        // Extract file paths if uploaded
        const imagePath = req.files['image'] ? req.files['image'][0].path : null;

        // Create News Object
        const newsData = new NewsModel({
            title,
            content,
            date,
            image : imagePath,
            category,
            tags,
            priority,
            status,
            pinned,
        });

        // Save to database
        const savedNews = await newsData.save();

        res.status(201).json({ 
            message: "News is created", 
            success: true, 
            data: savedNews
        });

    } catch (err) {
        console.error("Error creating news:", err);
        res.status(500).json({ message: "Internal Server Error", success: false, error: err.message });
    }
};


//Feaching all the News
const feachAllNews = async(req, res) => {
    try{
        const data = await NewsModel.find({});
        res.status(200)
            .json({message: 'All News', success: true, data});
    }catch(err){
        res.status(500).json({ message: 'Faialed to fatch  All News', success: false});
    }
}

//Updating the news
const updateNewsById = async(req, res) => {
    try{
        const id = req.params.id;
        const news = await NewsModel.findById(id);
        if (!news) {
            return res.status(404).json({ message: "News not found", success: false });
        }
        // Handle file uploads
        const image = req.files?.image ? req.files.image[0].path : news.image;
        
        const updatedData = { ...req.body, image };

        await NewsModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

        res.status(201)
            .json({message: 'News updated', success: true });
    }catch(err){
        res.status(500).json({ message: 'Faialed to update a News', success: false});
    }
}

//Deleting a news
const deleteNewsById = async(req, res) => {
    try{
        const id = req.params.id;
        await NewsModel.findByIdAndDelete(id);
        res.status(201)
            .json({message: 'News Deleted', success: true});
    }catch(err){
        res.status(500).json({ message: 'Faialed to delete a News', success: false});
    }
}

module.exports = {
    createNews,
    feachAllNews,
    updateNewsById,
    deleteNewsById
}