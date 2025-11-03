const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { scrapeOpportunities } = require('../services/scraper');
const { sendOpportunityEmail } = require('../services/email');

// Get latest opportunities
router.get('/opportunities', async (req, res) => {
    try {
        const opportunities = await scrapeOpportunities();
        
        res.json({
            success: true,
            count: opportunities.length,
            opportunities
        });
        
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Manual trigger for sending updates to all users
router.post('/send-all', async (req, res) => {
    try {
        if (!User) {
            return res.json({
                success: true,
                message: 'Running in demo mode - would send updates to all users'
            });
        }
        
        const users = await User.find({
            'notifications.opportunities': true
        });
        
        const opportunities = await scrapeOpportunities();
        let sentCount = 0;
        
        for (const user of users) {
            // Filter opportunities relevant to user
            const relevantOpps = filterOpportunitiesForUser(opportunities, user);
            
            if (relevantOpps.length > 0) {
                try {
                    await sendOpportunityEmail(user.email, user.name, relevantOpps);
                    
                    // Add opportunities to user record
                    user.opportunities.push(...relevantOpps.map(opp => ({
                        ...opp,
                        addedAt: new Date(),
                        notified: true
                    })));
                    
                    user.lastEmailSent = new Date();
                    await user.save();
                    
                    sentCount++;
                } catch (emailError) {
                    console.error(`Error sending email to ${user.email}:`, emailError);
                }
            }
        }
        
        res.json({
            success: true,
            message: `Updates sent to ${sentCount} users`,
            totalOpportunities: opportunities.length
        });
        
    } catch (error) {
        console.error('Error sending updates:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Filter opportunities based on user profile
function filterOpportunitiesForUser(opportunities, user) {
    return opportunities.filter(opp => {
        // Filter by plan type
        if (opp.categories) {
            const userCategories = [user.planType, user.field?.toLowerCase()];
            const hasMatch = opp.categories.some(cat => 
                userCategories.some(userCat => 
                    userCat && cat.toLowerCase().includes(userCat.toLowerCase())
                )
            );
            if (!hasMatch) return false;
        }
        
        // Filter by interests
        if (user.interests && opp.keywords) {
            const userInterests = user.interests.toLowerCase().split(',').map(i => i.trim());
            const hasInterestMatch = opp.keywords.some(keyword =>
                userInterests.some(interest => keyword.toLowerCase().includes(interest))
            );
            if (!hasInterestMatch) return false;
        }
        
        return true;
    });
}

module.exports = router;
