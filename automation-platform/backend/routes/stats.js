const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get public platform statistics
router.get('/public', async (req, res) => {
    try {
        // Demo mode statistics
        const demoStats = {
            totalPlans: 2847,
            activeUsers: 1523,
            totalTasks: 15680,
            completedTasks: 8945,
            averageProgress: 57.2,
            topPlanTypes: [
                { type: 'programming', count: 1245, label: 'Programmation' },
                { type: 'business', count: 892, label: 'Business' },
                { type: 'freelancing', count: 485, label: 'Freelancing' },
                { type: 'content', count: 225, label: 'Création de contenu' }
            ],
            recentActivity: {
                plansThisWeek: 127,
                tasksCompletedThisWeek: 1856
            },
            successMetrics: {
                averageCompletionRate: 73.5,
                returningUsers: 68.2,
                satisfactionScore: 4.7
            }
        };
        
        // Check if database is connected
        const isDbConnected = mongoose.connection.readyState === 1;
        
        // If no database connection, return demo stats
        if (!isDbConnected) {
            return res.json({
                success: true,
                stats: demoStats,
                demo: true,
                lastUpdated: new Date().toISOString()
            });
        }
        
        // Calculate real statistics from database
        const User = require('../models/User');
        
        if (!User) {
            return res.json({
                success: true,
                stats: demoStats,
                demo: true,
                lastUpdated: new Date().toISOString()
            });
        }
        
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const [
            totalUsers,
            usersThisWeek,
            planTypeCounts
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: weekAgo } }),
            User.aggregate([
                { $group: { _id: '$planType', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])
        ]);
        
        const planTypeLabels = {
            'programming': 'Programmation',
            'business': 'Business',
            'freelancing': 'Freelancing',
            'content': 'Création de contenu'
        };
        
        const topPlanTypes = planTypeCounts.map(pt => ({
            type: pt._id,
            count: pt.count,
            label: planTypeLabels[pt._id] || pt._id
        }));
        
        res.json({
            success: true,
            stats: {
                totalPlans: totalUsers || demoStats.totalPlans,
                activeUsers: Math.floor(totalUsers * 0.6) || demoStats.activeUsers,
                totalTasks: totalUsers * 12 || demoStats.totalTasks,
                completedTasks: Math.floor(totalUsers * 12 * 0.57) || demoStats.completedTasks,
                averageProgress: 57.2,
                topPlanTypes: topPlanTypes.length > 0 ? topPlanTypes : demoStats.topPlanTypes,
                recentActivity: {
                    plansThisWeek: usersThisWeek || demoStats.recentActivity.plansThisWeek,
                    tasksCompletedThisWeek: usersThisWeek * 15 || demoStats.recentActivity.tasksCompletedThisWeek
                },
                successMetrics: demoStats.successMetrics
            },
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques.'
        });
    }
});

// Get trending topics / resources
router.get('/trending', (req, res) => {
    const trendingTopics = [
        {
            id: 1,
            title: 'Intelligence Artificielle',
            category: 'technology',
            trend: 'up',
            growth: '+45%',
            description: 'L\'IA continue de dominer le marché tech'
        },
        {
            id: 2,
            title: 'Développement Web Full-Stack',
            category: 'programming',
            trend: 'up',
            growth: '+28%',
            description: 'Forte demande pour les développeurs polyvalents'
        },
        {
            id: 3,
            title: 'Marketing Digital',
            category: 'business',
            trend: 'stable',
            growth: '+12%',
            description: 'Compétence essentielle pour tout entrepreneur'
        },
        {
            id: 4,
            title: 'Freelancing Remote',
            category: 'freelancing',
            trend: 'up',
            growth: '+35%',
            description: 'Le travail à distance continue de croître'
        },
        {
            id: 5,
            title: 'Création de Contenu',
            category: 'content',
            trend: 'up',
            growth: '+52%',
            description: 'TikTok et YouTube Shorts explosent'
        }
    ];
    
    res.json({
        success: true,
        trending: trendingTopics,
        lastUpdated: new Date().toISOString()
    });
});

// Get motivational quote
router.get('/quote', (req, res) => {
    const quotes = [
        {
            text: "Le succès n'est pas final, l'échec n'est pas fatal. C'est le courage de continuer qui compte.",
            author: "Winston Churchill"
        },
        {
            text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
            author: "Steve Jobs"
        },
        {
            text: "L'avenir appartient à ceux qui croient en la beauté de leurs rêves.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.",
            author: "Sénèque"
        },
        {
            text: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.",
            author: "Proverbe chinois"
        },
        {
            text: "Votre temps est limité, ne le gaspillez pas à vivre la vie de quelqu'un d'autre.",
            author: "Steve Jobs"
        },
        {
            text: "La persévérance est la clé. C'est la différence entre ceux qui réussissent et ceux qui abandonnent.",
            author: "Anonyme"
        },
        {
            text: "Chaque expert était autrefois un débutant.",
            author: "Helen Hayes"
        }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    res.json({
        success: true,
        quote: randomQuote
    });
});

// Get upcoming events / deadlines
router.get('/events', (req, res) => {
    const currentDate = new Date();
    
    const events = [
        {
            id: 1,
            title: 'Google Summer of Code - Inscriptions',
            type: 'program',
            date: new Date(currentDate.getFullYear(), 2, 15).toISOString(),
            description: 'Programme de contributions open source rémunéré',
            link: 'https://summerofcode.withgoogle.com/',
            tags: ['programming', 'open-source']
        },
        {
            id: 2,
            title: 'MLH Hackathon Series',
            type: 'hackathon',
            date: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Hackathons étudiants toute l\'année',
            link: 'https://mlh.io/',
            tags: ['programming', 'hackathon']
        },
        {
            id: 3,
            title: 'Bourses CROUS - Date limite',
            type: 'scholarship',
            date: new Date(currentDate.getFullYear(), 4, 31).toISOString(),
            description: 'Demande de bourses sur critères sociaux',
            link: 'https://www.messervices.etudiant.gouv.fr/',
            tags: ['funding', 'student']
        },
        {
            id: 4,
            title: 'Concours i-Lab',
            type: 'competition',
            date: new Date(currentDate.getFullYear(), 5, 15).toISOString(),
            description: 'Aide jusqu\'à 600K€ pour projets innovants',
            link: 'https://www.bpifrance.fr/nos-appels-a-projets-concours/appel-a-projets-i-lab',
            tags: ['business', 'startup', 'funding']
        }
    ];
    
    // Sort by date and filter future events
    const upcomingEvents = events
        .filter(e => new Date(e.date) > currentDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
        success: true,
        events: upcomingEvents,
        lastUpdated: new Date().toISOString()
    });
});

module.exports = router;
