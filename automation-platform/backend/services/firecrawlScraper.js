const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Enhanced scraper using Firecrawl-like approach
 * Collects data from various sources for student opportunities
 */

// Firecrawl API integration (if API key is provided)
const scrapeWithFirecrawl = async (url, options = {}) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
        console.log('Firecrawl API key not configured, using fallback scraping');
        return null;
    }
    
    try {
        const response = await axios.post('https://api.firecrawl.dev/v0/scrape', {
            url: url,
            pageOptions: {
                onlyMainContent: true,
                includeHtml: false
            },
            ...options
        }, {
            headers: {
                'Authorization': `Bearer ${firecrawlApiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        return response.data;
    } catch (error) {
        console.error('Firecrawl scraping error:', error.message);
        return null;
    }
};

// Enhanced opportunity scraper with multiple sources
const scrapeOpportunities = async (filters = {}) => {
    const opportunities = [];
    
    try {
        // Scrape from multiple sources in parallel
        const scrapers = [
            scrapeDevpost(filters),
            scrapeHackathonCom(filters),
            scrapeKaggle(filters),
            scrapeGitHubJobs(filters)
        ];
        
        const results = await Promise.allSettled(scrapers);
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                opportunities.push(...result.value);
            }
        });
        
    } catch (error) {
        console.error('Error scraping opportunities:', error);
    }
    
    // Add static opportunities
    opportunities.push(...getStaticOpportunities(filters));
    
    // Apply filters
    return filterOpportunities(opportunities, filters);
};

// Scrape Devpost hackathons
const scrapeDevpost = async (filters = {}) => {
    try {
        const response = await axios.get('https://devpost.com/hackathons', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const hackathons = [];
        
        $('.challenge-listing').slice(0, 10).each((i, elem) => {
            const title = $(elem).find('.challenge-title').text().trim();
            const url = 'https://devpost.com' + $(elem).find('a').attr('href');
            const deadline = $(elem).find('.date').text().trim();
            const prizeText = $(elem).find('.prize-amount').text().trim();
            
            if (title && url) {
                hackathons.push({
                    type: 'Hackathon',
                    title,
                    description: `Hackathon sur Devpost${prizeText ? ' - ' + prizeText : ''}`,
                    url,
                    deadline: deadline || null,
                    source: 'Devpost',
                    categories: ['programming', 'tech'],
                    keywords: ['code', 'développement', 'innovation', 'hackathon'],
                    scrapedAt: new Date().toISOString()
                });
            }
        });
        
        return hackathons;
        
    } catch (error) {
        console.error('Error scraping Devpost:', error.message);
        return [];
    }
};

// Scrape Hackathon.com
const scrapeHackathonCom = async (filters = {}) => {
    try {
        const response = await axios.get('https://www.hackathon.com/events', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const hackathons = [];
        
        $('.event-card, .hackathon-tile').slice(0, 10).each((i, elem) => {
            const title = $(elem).find('.event-title, h3, h4').first().text().trim();
            const link = $(elem).find('a').first().attr('href');
            const url = link ? (link.startsWith('http') ? link : 'https://www.hackathon.com' + link) : null;
            
            if (title && url) {
                hackathons.push({
                    type: 'Hackathon',
                    title,
                    description: 'Hackathon international',
                    url,
                    deadline: null,
                    source: 'Hackathon.com',
                    categories: ['programming', 'tech'],
                    keywords: ['code', 'développement', 'compétition'],
                    scrapedAt: new Date().toISOString()
                });
            }
        });
        
        return hackathons;
        
    } catch (error) {
        console.error('Error scraping Hackathon.com:', error.message);
        return [];
    }
};

// Scrape Kaggle competitions
const scrapeKaggle = async (filters = {}) => {
    try {
        const response = await axios.get('https://www.kaggle.com/competitions', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const competitions = [];
        
        // Kaggle uses React, so we might not get all data, but we try
        $('[data-testid*="competition"], .competition-card').slice(0, 5).each((i, elem) => {
            const title = $(elem).find('h4, h3, .competition-title').first().text().trim();
            const link = $(elem).find('a').first().attr('href');
            const url = link ? (link.startsWith('http') ? link : 'https://www.kaggle.com' + link) : null;
            
            if (title && url) {
                competitions.push({
                    type: 'Compétition',
                    title,
                    description: 'Compétition Data Science sur Kaggle',
                    url,
                    deadline: null,
                    source: 'Kaggle',
                    categories: ['programming', 'data science'],
                    keywords: ['machine learning', 'data science', 'IA', 'ML'],
                    scrapedAt: new Date().toISOString()
                });
            }
        });
        
        return competitions;
        
    } catch (error) {
        console.error('Error scraping Kaggle:', error.message);
        return [];
    }
};

// Scrape GitHub Jobs (or similar tech job boards)
const scrapeGitHubJobs = async (filters = {}) => {
    // GitHub Jobs is deprecated, but we can scrape other job boards
    // For now, return empty array
    return [];
};

// Static opportunities (curated list)
const getStaticOpportunities = (filters = {}) => {
    return [
        {
            type: 'Bourse',
            title: 'Bourse CROUS sur Critères Sociaux',
            description: 'Jusqu\'à 5 965€/an selon échelon. Pour tous les étudiants en France.',
            url: 'https://www.messervices.etudiant.gouv.fr',
            deadline: new Date(new Date().getFullYear(), 4, 31).toISOString(),
            source: 'CROUS',
            categories: ['all', 'finance', 'aide'],
            keywords: ['étudiant', 'bourse', 'aide financière', 'France'],
            featured: true
        },
        {
            type: 'Programme',
            title: 'GitHub Student Developer Pack',
            description: 'Accès gratuit à 100+ outils et services pour développeurs étudiants.',
            url: 'https://education.github.com/pack',
            deadline: null,
            source: 'GitHub',
            categories: ['programming', 'tech', 'tools'],
            keywords: ['développement', 'outils', 'gratuit', 'GitHub'],
            featured: true
        },
        {
            type: 'Entrepreneuriat',
            title: 'Prix PEPITE - Tremplin',
            description: 'Jusqu\'à 10 000€ pour étudiants-entrepreneurs. Concours national.',
            url: 'https://www.pepite-france.fr/prix-pepite',
            deadline: new Date(new Date().getFullYear(), 5, 30).toISOString(),
            source: 'PEPITE',
            categories: ['business', 'entrepreneurship', 'finance'],
            keywords: ['entrepreneuriat', 'startup', 'financement', 'concours'],
            featured: true
        },
        {
            type: 'Concours',
            title: 'Concours I-Lab',
            description: 'Jusqu\'à 600 000€ pour création entreprise innovante deeptech.',
            url: 'https://www.enseignementsup-recherche.gouv.fr/fr/concours-i-lab-48146',
            deadline: new Date(new Date().getFullYear(), 8, 30).toISOString(),
            source: 'Gouvernement',
            categories: ['business', 'tech', 'innovation'],
            keywords: ['innovation', 'startup', 'deeptech', 'financement'],
            featured: true
        },
        {
            type: 'Hackathon',
            title: 'Nuit de l\'Info',
            description: 'Hackathon national étudiant - Nuit de développement web en équipe.',
            url: 'https://www.nuitdelinfo.com',
            deadline: new Date(new Date().getFullYear(), 11, 1).toISOString(),
            source: 'Nuit de l\'Info',
            categories: ['programming', 'tech'],
            keywords: ['code', 'hackathon', 'développement web', 'équipe'],
            featured: true
        },
        {
            type: 'Formation',
            title: 'FreeCodeCamp - Formation Complète',
            description: 'Formations gratuites en développement web, data science, ML.',
            url: 'https://www.freecodecamp.org',
            deadline: null,
            source: 'FreeCodeCamp',
            categories: ['programming', 'learning'],
            keywords: ['apprentissage', 'formation', 'gratuit', 'web', 'certification']
        },
        {
            type: 'Plateforme',
            title: 'Malt - Freelancing Tech',
            description: 'Première plateforme freelance en France pour missions tech.',
            url: 'https://www.malt.fr',
            deadline: null,
            source: 'Malt',
            categories: ['freelancing', 'programming', 'work'],
            keywords: ['freelance', 'missions', 'tech', 'revenus']
        },
        {
            type: 'Aide',
            title: 'Aide à la Mobilité Internationale Erasmus+',
            description: '400€/mois pour séjours d\'études à l\'étranger en Europe.',
            url: 'https://info.erasmusplus.fr',
            deadline: new Date(new Date().getFullYear() + 1, 1, 28).toISOString(),
            source: 'Erasmus+',
            categories: ['all', 'international', 'finance'],
            keywords: ['international', 'mobilité', 'bourse', 'Europe']
        },
        {
            type: 'Événement',
            title: 'Station F - Événements Startups',
            description: 'Événements, networking et programmes d\'accélération startup.',
            url: 'https://stationf.co/events',
            deadline: null,
            source: 'Station F',
            categories: ['business', 'tech', 'networking'],
            keywords: ['entrepreneuriat', 'networking', 'startup', 'Paris']
        },
        {
            type: 'Compétition',
            title: 'Kaggle - Compétitions Data Science',
            description: 'Compétitions avec prix jusqu\'à 100 000$ en ML et data science.',
            url: 'https://www.kaggle.com/competitions',
            deadline: null,
            source: 'Kaggle',
            categories: ['programming', 'data science'],
            keywords: ['machine learning', 'data science', 'IA', 'compétition']
        },
        {
            type: 'Formation',
            title: 'OpenClassrooms - Parcours Diplômants',
            description: 'Formations diplômantes gratuites pour demandeurs d\'emploi.',
            url: 'https://openclassrooms.com',
            deadline: null,
            source: 'OpenClassrooms',
            categories: ['learning', 'all'],
            keywords: ['formation', 'diplôme', 'tech', 'business']
        },
        {
            type: 'Plateforme',
            title: 'Upwork - Freelancing International',
            description: 'Plateforme internationale de freelancing pour tous domaines.',
            url: 'https://www.upwork.com',
            deadline: null,
            source: 'Upwork',
            categories: ['freelancing', 'work'],
            keywords: ['freelance', 'international', 'missions', 'remote']
        }
    ];
};

// Filter opportunities based on criteria
const filterOpportunities = (opportunities, filters = {}) => {
    let filtered = [...opportunities];
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(opp => 
            opp.categories.includes(filters.category) || 
            opp.categories.includes('all')
        );
    }
    
    // Filter by type
    if (filters.type) {
        filtered = filtered.filter(opp => 
            opp.type.toLowerCase() === filters.type.toLowerCase()
        );
    }
    
    // Filter by keyword
    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(opp => 
            opp.title.toLowerCase().includes(keyword) ||
            opp.description?.toLowerCase().includes(keyword) ||
            opp.keywords.some(k => k.toLowerCase().includes(keyword))
        );
    }
    
    // Filter by deadline (upcoming only)
    if (filters.upcomingOnly) {
        const now = new Date();
        filtered = filtered.filter(opp => 
            !opp.deadline || new Date(opp.deadline) > now
        );
    }
    
    // Filter by featured
    if (filters.featuredOnly) {
        filtered = filtered.filter(opp => opp.featured === true);
    }
    
    // Sort by date (newest first or deadline soon)
    if (filters.sortBy === 'deadline') {
        filtered.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
    } else if (filters.sortBy === 'newest') {
        filtered.sort((a, b) => {
            const dateA = a.scrapedAt ? new Date(a.scrapedAt) : new Date(0);
            const dateB = b.scrapedAt ? new Date(b.scrapedAt) : new Date(0);
            return dateB - dateA;
        });
    }
    
    // Limit results
    if (filters.limit) {
        filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
};

// Get all available categories
const getCategories = () => {
    return [
        { id: 'all', name: 'Toutes les catégories', icon: '🌟' },
        { id: 'programming', name: 'Programmation', icon: '💻' },
        { id: 'business', name: 'Business', icon: '💼' },
        { id: 'freelancing', name: 'Freelancing', icon: '🚀' },
        { id: 'data science', name: 'Data Science', icon: '📊' },
        { id: 'tech', name: 'Tech', icon: '⚡' },
        { id: 'learning', name: 'Formation', icon: '📚' },
        { id: 'finance', name: 'Financement', icon: '💰' },
        { id: 'international', name: 'International', icon: '🌍' },
        { id: 'networking', name: 'Networking', icon: '🤝' },
        { id: 'innovation', name: 'Innovation', icon: '💡' }
    ];
};

// Get all opportunity types
const getOpportunityTypes = () => {
    return [
        'Hackathon',
        'Bourse',
        'Concours',
        'Formation',
        'Plateforme',
        'Événement',
        'Compétition',
        'Aide',
        'Programme',
        'Entrepreneuriat'
    ];
};

module.exports = {
    scrapeOpportunities,
    scrapeWithFirecrawl,
    filterOpportunities,
    getCategories,
    getOpportunityTypes
};
