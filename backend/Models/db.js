require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://patelkrishna01062003:123@cluster0.iqpyq.mongodb.net/coursesdb?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('MongoDB Connection Error...', err);
    });
