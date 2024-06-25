import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Email from '../models/email.js';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Cron job to send scheduled emails
export const scheduleEmails = () => {
    cron.schedule('*/10 * * * *', async () => { // Run every 10 minutes
        try {
            const currentDateTime = new Date();

            // Find emails scheduled for the current time
            const emailsToSend = await Email.find({
                scheduledDate: {
                    $lte: currentDateTime
                }
            });

            // Send each email
            emailsToSend.forEach(async (email) => {
                let mailDetails = {
                    from: process.env.EMAIL_USER,
                    to: email.to,
                    subject: email.subject,
                    text: email.text
                };

                // Sending Email
                await transporter.sendMail(mailDetails);
                console.log(`Email sent to ${email.to}`);
            });

            // Remove emails that have been sent
            await Email.deleteMany({
                scheduledDate: {
                    $lte: currentDateTime
                }
            });

        } catch (error) {
            console.error('Error scheduling emails:', error);
        }
    });
};
