const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Email = require('../models/email');
require('dotenv').config();

const router = express.Router();

// Email transport configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to send email
router.post('/send', async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        // Create email document
        const email = new Email({ to, subject, text });
        await email.save();

        // Send email
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        res.status(200).send({ message: 'Email sent', info });
    } catch (error) {
        res.status(500).send({ message: 'Error sending email', error });
    }
});

module.exports = router;
