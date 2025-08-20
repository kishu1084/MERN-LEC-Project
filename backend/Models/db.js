require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect('connection link of mongodb')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('MongoDB Connection Error...', err);
    });
