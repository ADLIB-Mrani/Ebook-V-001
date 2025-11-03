const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generatePlan } = require('../services/generator');
const { sendWelcomeEmail } = require('../services/email');

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

module.exports = router;
