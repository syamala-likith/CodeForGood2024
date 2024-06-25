const cron = require('node-cron');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/user'); // Renamed from Email to User for clarity

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

// Function to send alert email
const sendAlertEmail = async (user, project) => {
    const mailDetails = {
        from: config.EMAIL_USER,
        to: user.email,
        subject: 'Project Status Alert',
        text: `Project ${project.projectId} status is now 0. Please take action.`,
    };

    try {
        let info = await transporter.sendMail(mailDetails);
        console.log(`Alert email sent to ${user.email} for project ${project.projectId}: ${info.response}`);
    } catch (error) {
        console.error(`Error sending alert email to ${user.email} for project ${project.projectId}:`, error);
    }
};

// Function to fetch users from the database where type is "level1" and process projects
const fetchLevel1UsersAndProcessProjects = async () => {
    try {
        const level1Users = await User.find({ type: 'level1' });

        console.log(`Fetched ${level1Users.length} level1 users.`);

        for (const user of level1Users) {
            for (const project of user.projects) {
                if (project.status === 0) {
                    await sendAlertEmail(user, project);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching and processing users:', error);
    }
};

// Schedule cron job to check and send alerts every hour (adjust as needed)
cron.schedule('* * * * *', async () => { // Runs every minute
    console.log('Running the cron job');
    await fetchLevel1UsersAndProcessProjects();
});

// Connect to MongoDB
mongoose.connect(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        console.log('Email alert scheduler started.');
    })
    .catch(err => console.error('MongoDB connection error:', err));
