const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const scheduleEmails = require('./services/emailService');

const app = express();

// MongoDB connection
mongoose.connect(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        // Start scheduling emails after MongoDB connection is established
        scheduleEmails();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
