// pwdResetLogic.js

// Import necessary modules
const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

// Create an Express router
const router = express.Router();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'plannerswegroup14@gmail.com', // Your email address
        pass: 'Password123!@' // Your email password
    }
});

// Create MySQL connection pool
const db = mysql.createPool({
    host: 'database-1.cj4iawuucsa5.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'database123',
    database: "test_schema",
});

// Handle POST request to send passcode
router.post('/send-passcode', (req, res) => {
    const { email } = req.body;
    // Generate random passcode
    const passcode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit passcode
    // Send passcode to email using nodemailer
    const mailOptions = {
        from: 'plannerswegroup14@gmail.com',
        to: email,
        subject: 'Password Reset Passcode',
        text: `Your passcode is: ${passcode}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending passcode email:', error);
            res.status(500).json({ success: false, message: 'Failed to send passcode email' });
        } else {
            console.log('Passcode email sent:', info.response);
            // Store passcode in database with user's email for verification
            db.query('UPDATE users SET passcode = ? WHERE email = ?', [passcode, email], (error, results) => {
                if (error) {
                    console.error('Error storing passcode in database:', error);
                    res.status(500).json({ success: false, message: 'Failed to store passcode in database' });
                } else {
                    // Return success response to client
                    res.status(200).json({ success: true });
                }
            });
        }
    });
});

// Handle POST request to verify passcode
router.post('/verify-passcode', (req, res) => {
    const { email, passcode } = req.body;
    // Retrieve the passcode associated with the user's email from the database
    db.query('SELECT passcode FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error retrieving passcode from database:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve passcode from database' });
        } else {
            // Check if passcode matches the one stored in the database
            if (results.length > 0 && results[0].passcode === passcode) {
                // Return success response to client
                res.status(200).json({ success: true });
            } else {
                // Return failure response to client
                res.status(400).json({ success: false, message: 'Invalid passcode' });
            }
        }
    });
});

// Handle POST request to reset password
router.post('/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    // Update the user's password in the database with the new password
    db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], (error, results) => {
        if (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ success: false, message: 'Failed to reset password' });
        } else {
            // Check if the user exists and the password was updated successfully
            if (results.affectedRows > 0) {
                // Return success response to client
                res.status(200).json({ success: true });
            } else {
                // Return failure response to client
                res.status(404).json({ success: false, message: 'User not found' });
            }
        }
    });
});

// Export the router
module.exports = router;
