const axios = require('axios');
const cheerio = require('cheerio');

// Scrape opportunities from various sources
const scrapeOpportunities = async () => {
    const opportunities = [];
    
    try {
        // Scrape Devpost hackathons
        const hackathons = await scrapeDevpost();
        opportunities.push(...hackathons);
        
        // Add more scrapers here
        // const scholarships = await scrapeScholarships();
        // const jobs = await scrapeJobs();
        
    } catch (error) {
        console.error('Error scraping opportunities:', error);
    }
    
    // Add some static opportunities as fallback
    opportunities.push(...getStaticOpportunities());
    
    return opportunities;
};

// Scrape Devpost for hackathons
const scrapeDevpost = async () => {
    try {
        const response = await axios.get('https://devpost.com/hackathons', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        });
        
        const $ = cheerio.load(response.data);
        const hackathons = [];
        
        $('.challenge-listing').slice(0, 5).each((i, elem) => {
            const title = $(elem).find('.challenge-title').text().trim();
            const url = 'https://devpost.com' + $(elem).find('a').attr('href');
            const deadline = $(elem).find('.date').text().trim();
            
            if (title && url) {
                hackathons.push({
                    type: 'Hackathon',
                    title,
                    url,
                    deadline: deadline || null,
                    source: 'Devpost',
                    categories: ['programming', 'tech'],
                    keywords: ['code', 'développement', 'innovation']
                });
            }
        });
        
        return hackathons;
        
    } catch (error) {
        console.error('Error scraping Devpost:', error.message);
        return [];
    }
};

// Static opportunities (always available)
const getStaticOpportunities = () => {
    return [
        {
            type: 'Bourse',
            title: 'Bourse CROUS sur Critères Sociaux',
            description: 'Jusqu\'à 5 965€/an selon échelon',
            url: 'https://www.messervices.etudiant.gouv.fr',
            deadline: new Date(new Date().getFullYear(), 4, 31), // May 31
            source: 'CROUS',
            categories: ['all'],
            keywords: ['étudiant', 'bourse', 'aide financière']
        },
        {
            type: 'Programme',
            title: 'GitHub Student Developer Pack',
            description: 'Accès gratuit à 100+ outils et services',
            url: 'https://education.github.com/pack',
            deadline: null,
            source: 'GitHub',
            categories: ['programming', 'tech'],
            keywords: ['développement', 'outils', 'gratuit']
        },
        {
            type: 'Entrepreneuriat',
            title: 'Prix PEPITE - Tremplin',
            description: 'Jusqu\'à 10 000€ pour étudiants-entrepreneurs',
            url: 'https://www.pepite-france.fr/prix-pepite',
            deadline: new Date(new Date().getFullYear(), 5, 30), // June 30
            source: 'PEPITE',
            categories: ['business', 'entrepreneurship'],
            keywords: ['entrepreneuriat', 'startup', 'financement']
        },
        {
            type: 'Concours',
            title: 'Concours I-Lab',
            description: 'Jusqu\'à 600 000€ pour création entreprise innovante',
            url: 'https://www.enseignementsup-recherche.gouv.fr/fr/concours-i-lab-48146',
            deadline: new Date(new Date().getFullYear(), 8, 30), // September 30
            source: 'Gouvernement',
            categories: ['business', 'tech'],
            keywords: ['innovation', 'startup', 'deeptech']
        },
        {
            type: 'Hackathon',
            title: 'Nuit de l\'Info',
            description: 'Hackathon national étudiant - Nuit de développement',
            url: 'https://www.nuitdelinfo.com',
            deadline: new Date(new Date().getFullYear(), 11, 1), // December 1
            source: 'Nuit de l\'Info',
            categories: ['programming'],
            keywords: ['code', 'hackathon', 'développement web']
        },
        {
            type: 'Formation',
            title: 'FreeCodeCamp - Formation Complète',
            description: 'Formations gratuites en développement web',
            url: 'https://www.freecodecamp.org',
            deadline: null,
            source: 'FreeCodeCamp',
            categories: ['programming'],
            keywords: ['apprentissage', 'formation', 'gratuit', 'web']
        },
        {
            type: 'Plateforme',
            title: 'Malt - Freelancing Tech',
            description: 'Première plateforme freelance en France',
            url: 'https://www.malt.fr',
            deadline: null,
            source: 'Malt',
            categories: ['freelancing', 'programming'],
            keywords: ['freelance', 'missions', 'tech']
        },
        {
            type: 'Aide',
            title: 'Aide à la Mobilité Internationale Erasmus+',
            description: '400€/mois pour séjours d\'études à l\'étranger',
            url: 'https://info.erasmusplus.fr',
            deadline: new Date(new Date().getFullYear() + 1, 1, 28), // February 28 next year
            source: 'Erasmus+',
            categories: ['all'],
            keywords: ['international', 'mobilité', 'bourse']
        },
        {
            type: 'Événement',
            title: 'Station F - Événements Startups',
            description: 'Événements, networking et programmes d\'accélération',
            url: 'https://stationf.co/events',
            deadline: null,
            source: 'Station F',
            categories: ['business', 'tech'],
            keywords: ['entrepreneuriat', 'networking', 'startup']
        },
        {
            type: 'Compétition',
            title: 'Kaggle - Compétitions Data Science',
            description: 'Compétitions avec prix jusqu\'à 100 000$',
            url: 'https://www.kaggle.com/competitions',
            deadline: null,
            source: 'Kaggle',
            categories: ['programming', 'data science'],
            keywords: ['machine learning', 'data science', 'IA']
        }
    ];
};

module.exports = {
    scrapeOpportunities
};
