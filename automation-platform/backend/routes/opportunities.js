const express = require('express');
const router = express.Router();
const { 
    scrapeOpportunities, 
    getCategories, 
    getOpportunityTypes 
} = require('../services/firecrawlScraper');
const NodeCache = require('node-cache');

// Cache for 15 minutes
const cache = new NodeCache({ stdTTL: 900 });

/**
 * GET /api/opportunities
 * Get opportunities with filtering
 * Query params: category, type, keyword, upcomingOnly, featuredOnly, sortBy, limit
 */
router.get('/', async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            type: req.query.type,
            keyword: req.query.keyword,
            upcomingOnly: req.query.upcomingOnly === 'true',
            featuredOnly: req.query.featuredOnly === 'true',
            sortBy: req.query.sortBy || 'newest',
            limit: parseInt(req.query.limit) || 50
        };
        
        // Create cache key from filters
        const cacheKey = `opportunities_${JSON.stringify(filters)}`;
        
        // Check cache first
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                opportunities: cachedData,
                cached: true,
                count: cachedData.length
            });
        }
        
        // Scrape and filter
        const opportunities = await scrapeOpportunities(filters);
        
        // Cache the results
        cache.set(cacheKey, opportunities);
        
        res.json({
            success: true,
            opportunities,
            cached: false,
            count: opportunities.length
        });
        
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch opportunities',
            message: error.message
        });
    }
});

/**
 * GET /api/opportunities/categories
 * Get all available categories
 */
router.get('/categories', (req, res) => {
    try {
        const categories = getCategories();
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

/**
 * GET /api/opportunities/types
 * Get all opportunity types
 */
router.get('/types', (req, res) => {
    try {
        const types = getOpportunityTypes();
        res.json({
            success: true,
            types
        });
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch types'
        });
    }
});

/**
 * POST /api/opportunities/refresh
 * Force refresh cache
 */
router.post('/refresh', async (req, res) => {
    try {
        // Clear cache
        cache.flushAll();
        
        // Fetch fresh data
        const opportunities = await scrapeOpportunities({});
        
        res.json({
            success: true,
            message: 'Cache refreshed',
            count: opportunities.length
        });
        
    } catch (error) {
        console.error('Error refreshing opportunities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refresh opportunities'
        });
    }
});

module.exports = router;
