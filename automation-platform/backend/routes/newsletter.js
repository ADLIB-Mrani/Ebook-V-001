const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Rate limiter for newsletter subscriptions - 5 requests per hour per IP
const subscriptionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { success: false, error: 'Trop de tentatives. Réessaye dans 1 heure.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Email validation regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Check if database is connected
function isDbConnected() {
    return mongoose.connection.readyState === 1;
}

// Subscribe to newsletter
router.post('/subscribe', subscriptionLimiter, async (req, res) => {
    try {
        const { email, name, interests, frequency } = req.body;
        
        // Validate email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Adresse email invalide'
            });
        }
        
        // Validate interests if provided
        const validInterests = ['programming', 'business', 'freelancing', 'content', 'general'];
        const filteredInterests = interests 
            ? interests.filter(i => validInterests.includes(i))
            : ['general'];
        
        // Validate frequency if provided
        const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
        const validatedFrequency = validFrequencies.includes(frequency) ? frequency : 'weekly';
        
        // Demo mode if no database connection
        if (!isDbConnected()) {
            return res.json({
                success: true,
                message: 'Inscription réussie ! Tu recevras bientôt nos actualités.',
                demo: true
            });
        }
        
        const Newsletter = require('../models/Newsletter');
        
        // Demo mode if Newsletter model not available
        if (!Newsletter) {
            return res.json({
                success: true,
                message: 'Inscription réussie ! Tu recevras bientôt nos actualités.',
                demo: true
            });
        }
        
        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    success: false,
                    error: 'Cette adresse email est déjà inscrite à notre newsletter.'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.interests = filteredInterests;
                existingSubscriber.frequency = validatedFrequency;
                if (name) existingSubscriber.name = name;
                await existingSubscriber.save();
                
                return res.json({
                    success: true,
                    message: 'Ton inscription a été réactivée ! Bienvenue de retour.'
                });
            }
        }
        
        // Create new subscriber
        const subscriber = new Newsletter({
            email: email.toLowerCase(),
            name: name || '',
            interests: filteredInterests,
            frequency: validatedFrequency,
            source: 'website'
        });
        
        await subscriber.save();
        
        res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Tu recevras bientôt nos actualités.',
            data: {
                email: subscriber.email,
                frequency: subscriber.frequency
            }
        });
        
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Cette adresse email est déjà inscrite.'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
});

// Unsubscribe from newsletter
router.get('/unsubscribe/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token || typeof token !== 'string' || token.length !== 64) {
            return res.status(400).json({
                success: false,
                error: 'Token de désinscription invalide'
            });
        }
        
        // Demo mode if no database
        if (!isDbConnected()) {
            return res.json({
                success: true,
                message: 'Désinscription réussie.',
                demo: true
            });
        }
        
        const Newsletter = require('../models/Newsletter');
        
        if (!Newsletter) {
            return res.json({
                success: true,
                message: 'Désinscription réussie.',
                demo: true
            });
        }
        
        const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                error: 'Lien de désinscription invalide ou expiré.'
            });
        }
        
        subscriber.isActive = false;
        await subscriber.save();
        
        res.json({
            success: true,
            message: 'Tu as été désinscrit(e) de notre newsletter. Tu peux te réinscrire à tout moment.'
        });
        
    } catch (error) {
        console.error('Error unsubscribing:', error);
        res.status(500).json({
            success: false,
            error: 'Une erreur est survenue lors de la désinscription.'
        });
    }
});

// Update subscription preferences
router.patch('/preferences', async (req, res) => {
    try {
        const { email, interests, frequency } = req.body;
        
        // Validate email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Adresse email invalide'
            });
        }
        
        // Demo mode if no database
        if (!isDbConnected()) {
            return res.json({
                success: true,
                message: 'Préférences mises à jour.',
                demo: true
            });
        }
        
        const Newsletter = require('../models/Newsletter');
        
        if (!Newsletter) {
            return res.json({
                success: true,
                message: 'Préférences mises à jour.',
                demo: true
            });
        }
        
        const subscriber = await Newsletter.findOne({ email: email.toLowerCase(), isActive: true });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                error: 'Aucun abonnement trouvé pour cette adresse email.'
            });
        }
        
        // Update preferences
        if (interests && Array.isArray(interests)) {
            const validInterests = ['programming', 'business', 'freelancing', 'content', 'general'];
            subscriber.interests = interests.filter(i => validInterests.includes(i));
        }
        
        if (frequency) {
            const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
            if (validFrequencies.includes(frequency)) {
                subscriber.frequency = frequency;
            }
        }
        
        await subscriber.save();
        
        res.json({
            success: true,
            message: 'Tes préférences ont été mises à jour.',
            data: {
                interests: subscriber.interests,
                frequency: subscriber.frequency
            }
        });
        
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            error: 'Une erreur est survenue.'
        });
    }
});

// Get newsletter statistics (public, limited data)
router.get('/stats', async (req, res) => {
    try {
        // Demo mode if no database
        if (!isDbConnected()) {
            return res.json({
                success: true,
                stats: {
                    totalSubscribers: 1247,
                    thisMonth: 89,
                    averageOpenRate: 42.5
                },
                demo: true
            });
        }
        
        const Newsletter = require('../models/Newsletter');
        
        if (!Newsletter) {
            return res.json({
                success: true,
                stats: {
                    totalSubscribers: 1247,
                    thisMonth: 89,
                    averageOpenRate: 42.5
                },
                demo: true
            });
        }
        
        const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        
        const thisMonthSubscribers = await Newsletter.countDocuments({
            isActive: true,
            subscribedAt: { $gte: thisMonthStart }
        });
        
        res.json({
            success: true,
            stats: {
                totalSubscribers,
                thisMonth: thisMonthSubscribers,
                averageOpenRate: 42.5 // Placeholder
            }
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques.'
        });
    }
});

module.exports = router;
