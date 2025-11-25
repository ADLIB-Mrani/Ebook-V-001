const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Rate limiter for contact form - 3 requests per hour per IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { success: false, error: 'Trop de messages envoyés. Réessaye dans 1 heure.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Email validation regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Check if database is connected
function isDbConnected() {
    return mongoose.connection.readyState === 1;
}

// Submit contact form
router.post('/submit', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message, category } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Tous les champs obligatoires doivent être remplis.'
            });
        }
        
        // Validate email
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Adresse email invalide.'
            });
        }
        
        // Validate lengths
        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Le nom ne doit pas dépasser 100 caractères.'
            });
        }
        
        if (subject.length > 200) {
            return res.status(400).json({
                success: false,
                error: 'Le sujet ne doit pas dépasser 200 caractères.'
            });
        }
        
        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Le message ne doit pas dépasser 5000 caractères.'
            });
        }
        
        // Validate category
        const validCategories = ['general', 'support', 'feedback', 'partnership', 'bug_report'];
        const validatedCategory = validCategories.includes(category) ? category : 'general';
        
        // Demo mode if no database
        if (!isDbConnected()) {
            return res.json({
                success: true,
                message: 'Message envoyé avec succès ! Nous te répondrons sous 24-48h.',
                demo: true,
                ticketId: Math.random().toString(36).substring(2, 10).toUpperCase()
            });
        }
        
        const Contact = require('../models/Contact');
        
        if (!Contact) {
            return res.json({
                success: true,
                message: 'Message envoyé avec succès ! Nous te répondrons sous 24-48h.',
                demo: true,
                ticketId: Math.random().toString(36).substring(2, 10).toUpperCase()
            });
        }
        
        // Create contact entry
        const contact = new Contact({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            subject: subject.trim(),
            message: message.trim(),
            category: validatedCategory,
            ipAddress: req.ip || req.socket?.remoteAddress,
            userAgent: req.get('User-Agent')?.substring(0, 500)
        });
        
        await contact.save();
        
        // Send notification email (optional - if configured)
        try {
            const { sendContactNotification } = require('../services/email');
            if (typeof sendContactNotification === 'function') {
                await sendContactNotification(contact);
            }
        } catch (emailError) {
            // Continue even if notification fails
            console.log('Contact notification email skipped:', emailError.message);
        }
        
        res.status(201).json({
            success: true,
            message: 'Message envoyé avec succès ! Nous te répondrons sous 24-48h.',
            ticketId: contact._id.toString().slice(-8).toUpperCase()
        });
        
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            error: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        });
    }
});

// Get contact form categories
router.get('/categories', (req, res) => {
    res.json({
        success: true,
        categories: [
            { value: 'general', label: 'Question générale' },
            { value: 'support', label: 'Support technique' },
            { value: 'feedback', label: 'Feedback / Suggestions' },
            { value: 'partnership', label: 'Partenariat / Collaboration' },
            { value: 'bug_report', label: 'Signaler un bug' }
        ]
    });
});

module.exports = router;
