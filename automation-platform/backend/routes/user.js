const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { generatePlan } = require('../services/generator');
const { sendWelcomeEmail } = require('../services/email');
const { generatePlanPDF } = require('../services/pdfGenerator');
const path = require('path');
const fs = require('fs');

// Rate limiter for PDF downloads - 10 requests per 15 minutes per IP
const pdfDownloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Trop de requêtes de téléchargement PDF. Réessaye dans 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Create new user and generate plan
router.post('/create', async (req, res) => {
    try {
        const userData = req.body;
        
        // Generate personalized plan
        const plan = await generatePlan(userData);
        
        // Create user object
        const user = {
            ...userData,
            plan,
            createdAt: new Date(),
            lastUpdated: new Date()
        };
        
        // Save to database if connected
        if (User) {
            const newUser = new User(user);
            await newUser.save();
        }
        
        // Send welcome email
        try {
            await sendWelcomeEmail(userData.email, userData.name, plan);
        } catch (emailError) {
            console.error('Email error:', emailError);
            // Continue even if email fails
        }
        
        res.json({
            success: true,
            userId: user.userId,
            plan: plan,
            message: 'Plan created successfully'
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get user plan
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        let user;
        if (User) {
            user = await User.findOne({ userId });
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update user progress
router.patch('/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { taskId, completed } = req.body;
        
        if (User) {
            const user = await User.findOne({ userId });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            
            // Update task completion
            const task = user.plan.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = completed;
                task.completedAt = completed ? new Date() : null;
            }
            
            user.lastUpdated = new Date();
            await user.save();
            
            res.json({
                success: true,
                message: 'Progress updated'
            });
        } else {
            res.json({
                success: true,
                message: 'Running in demo mode'
            });
        }
        
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send PDF via email
router.post('/send-pdf-email', pdfDownloadLimiter, async (req, res) => {
    try {
        const planData = req.body;
        
        // Validate input
        if (!planData || !planData.name || !planData.email) {
            return res.status(400).json({
                success: false,
                error: 'Invalid plan data or email'
            });
        }
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Sanitize filename to prevent path traversal
        const safeName = planData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const fileName = `plan_${safeName}_${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);
        
        // Verify path is within temp directory (prevent path traversal)
        const normalizedPath = path.normalize(filePath);
        const normalizedTempDir = path.normalize(tempDir);
        if (!normalizedPath.startsWith(normalizedTempDir)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file path'
            });
        }
        
        // Generate PDF
        await generatePlanPDF(planData, filePath);
        
        // Send email with PDF attachment
        const { sendPDFEmail } = require('../services/email');
        await sendPDFEmail(planData.email, planData.name, filePath);
        
        // Delete temp file after sending
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (deleteErr) {
                console.error('Error deleting temp file:', deleteErr);
            }
        }, 5000);
        
        res.json({
            success: true,
            message: 'PDF sent successfully via email'
        });
        
    } catch (error) {
        console.error('Error sending PDF email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download user plan as PDF (with rate limiting)
router.post('/download-pdf', pdfDownloadLimiter, async (req, res) => {
    try {
        const planData = req.body;
        
        // Validate and sanitize input
        if (!planData || !planData.name) {
            return res.status(400).json({
                success: false,
                error: 'Invalid plan data'
            });
        }
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Sanitize filename to prevent path traversal
        const safeName = planData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const fileName = `plan_${safeName}_${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);
        
        // Verify path is within temp directory (prevent path traversal)
        const normalizedPath = path.normalize(filePath);
        const normalizedTempDir = path.normalize(tempDir);
        if (!normalizedPath.startsWith(normalizedTempDir)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file path'
            });
        }
        
        // Generate PDF
        await generatePlanPDF(planData, filePath);
        
        // Send file for download
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    success: false,
                    error: 'Error sending PDF'
                });
            }
            
            // Delete file after sending
            setTimeout(() => {
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (deleteErr) {
                    console.error('Error deleting temp file:', deleteErr);
                }
            }, 5000);
        });
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
