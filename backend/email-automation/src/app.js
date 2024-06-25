const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2222;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/email', emailRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
