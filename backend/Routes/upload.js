const multer = require("multer");

// Define storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files to 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Multer instance
const upload = multer({ storage: storage });

module.exports = upload;
