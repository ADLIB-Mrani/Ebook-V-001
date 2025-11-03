const fs = require('fs');
const path = require('path');

// Load plan templates
const loadPlanTemplate = (planType) => {
    const templatePath = path.join(__dirname, '../../config/plans', `${planType}.json`);
    
    try {
        if (fs.existsSync(templatePath)) {
            return JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        }
    } catch (error) {
        console.error(`Error loading template for ${planType}:`, error);
    }
    
    // Return default template if file doesn't exist
    return getDefaultTemplate(planType);
};

// Default template generator
const getDefaultTemplate = (planType) => {
    const templates = {
        programming: {
            title: 'Maîtriser la Programmation',
            description: 'Un parcours complet pour devenir développeur',
            duration: '6-12 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '2 mois',
                    tasks: [
                        'Choisir un langage (Python recommandé pour débuter)',
                        'Suivre cours FreeCodeCamp ou The Odin Project',
                        'Comprendre variables, boucles, fonctions',
                        'Premier projet: Calculatrice',
                        'Apprendre Git et GitHub'
                    ]
                },
                {
                    name: 'Développement Web',
                    duration: '3 mois',
                    tasks: [
                        'HTML/CSS fondamentaux',
                        'JavaScript moderne (ES6+)',
                        'Créer 3 projets portfolio',
                        'Framework (React ou Vue.js)',
                        'Backend basics (Node.js)'
                    ]
                },
                {
                    name: 'Projets et Portfolio',
                    duration: '2 mois',
                    tasks: [
                        'Construire portfolio professionnel',
                        'Projet full-stack complet',
                        'Contribuer à l\'open source',
                        'Documenter projets GitHub',
                        'Préparer CV tech'
                    ]
                },
                {
                    name: 'Spécialisation et Job',
                    duration: '3+ mois',
                    tasks: [
                        'Choisir spécialisation (Frontend/Backend/Full-stack)',
                        'Approfondir technologies choisies',
                        'Participer à hackathons',
                        'Postuler stages/emplois',
                        'Networking LinkedIn'
                    ]
                }
            ],
            resources: [
                { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org', type: 'Cours gratuit' },
                { name: 'The Odin Project', url: 'https://www.theodinproject.com', type: 'Cours gratuit' },
                { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'Documentation' },
                { name: 'GitHub Student Pack', url: 'https://education.github.com/pack', type: 'Outils gratuits' },
                { name: 'CS50', url: 'https://cs50.harvard.edu', type: 'Cours Harvard gratuit' }
            ],
            opportunities: [
                'Hackathons (Devpost, MLH)',
                'Stage via Malt ou Welcome to the Jungle',
                'Freelancing sur ComeUp',
                'Contributions open source',
                'Concours Google Hash Code'
            ]
        },
        business: {
            title: 'Lancer Mon Business',
            description: 'De l\'idée à la micro-entreprise rentable',
            duration: '6-12 mois',
            phases: [
                {
                    name: 'Validation d\'Idée',
                    duration: '1 mois',
                    tasks: [
                        'Identifier problème à résoudre',
                        'Recherche marché et concurrence',
                        'Sondage auprès de cible',
                        'MVP (Minimum Viable Product)',
                        'Premiers feedbacks'
                    ]
                },
                {
                    name: 'Création Légale',
                    duration: '1 mois',
                    tasks: [
                        'S\'inscrire au PEPITE de l\'université',
                        'Créer micro-entreprise (gratuit)',
                        'Ouvrir compte bancaire dédié',
                        'Comprendre obligations fiscales',
                        'Assurance RC Pro si nécessaire'
                    ]
                },
                {
                    name: 'Lancement',
                    duration: '2-3 mois',
                    tasks: [
                        'Site web professionnel',
                        'Réseaux sociaux (3 plateformes max)',
                        'Premiers clients (entourage, réseau)',
                        'Itérer produit selon feedback',
                        'Facturation et comptabilité'
                    ]
                },
                {
                    name: 'Croissance',
                    duration: '6+ mois',
                    tasks: [
                        'Marketing digital (SEO, publicités)',
                        'Automatisation processus',
                        'Déléguer tâches répétitives',
                        'Lever fonds si nécessaire (BPI, PEPITE)',
                        'Scaler le business'
                    ]
                }
            ],
            resources: [
                { name: 'PEPITE France', url: 'https://www.pepite-france.fr', type: 'Accompagnement' },
                { name: 'Auto-entrepreneur URSSAF', url: 'https://www.autoentrepreneur.urssaf.fr', type: 'Création' },
                { name: 'BPI France', url: 'https://www.bpifrance.fr', type: 'Financement' },
                { name: 'Station F', url: 'https://stationf.co', type: 'Incubateur' },
                { name: 'French Tech', url: 'https://lafrenchtech.com', type: 'Écosystème' }
            ],
            opportunities: [
                'Prix PEPITE (10 000€)',
                'Concours I-Lab (600 000€)',
                'Bourse French Tech',
                'Prêt étudiant garanti (20 000€)',
                'Aides régionales'
            ]
        },
        freelancing: {
            title: 'Devenir Freelance',
            description: 'Construire une activité freelance rentable',
            duration: '3-6 mois',
            phases: [
                {
                    name: 'Préparation',
                    duration: '1 mois',
                    tasks: [
                        'Identifier compétences commercialisables',
                        'Définir niche et positionnement',
                        'Fixer tarifs (recherche marché)',
                        'Créer portfolio solide',
                        'Préparer templates (devis, factures)'
                    ]
                },
                {
                    name: 'Setup Légal',
                    duration: '2 semaines',
                    tasks: [
                        'Créer micro-entreprise',
                        'S\'inscrire sur Malt',
                        'Profils Upwork, Fiverr, ComeUp',
                        'LinkedIn professionnel',
                        'CGV et contrat type'
                    ]
                },
                {
                    name: 'Premiers Clients',
                    duration: '2 mois',
                    tasks: [
                        'Proposer services réseau proche',
                        'Répondre à 10-20 annonces/semaine',
                        'Offre découverte (tarif réduit)',
                        'Sur-délivrer sur premiers projets',
                        'Demander témoignages et recommandations'
                    ]
                },
                {
                    name: 'Scaling',
                    duration: '3+ mois',
                    tasks: [
                        'Augmenter tarifs progressivement',
                        'Spécialisation dans niche',
                        'Automatiser processus (templates, outils)',
                        'Marketing de contenu (blog, LinkedIn)',
                        'Clients récurrents (maintenance, retainer)'
                    ]
                }
            ],
            resources: [
                { name: 'Malt', url: 'https://www.malt.fr', type: 'Plateforme FR' },
                { name: 'ComeUp', url: 'https://comeup.com', type: 'Micro-services' },
                { name: 'Upwork', url: 'https://www.upwork.com', type: 'International' },
                { name: 'Fiverr', url: 'https://www.fiverr.com', type: 'International' },
                { name: 'Crème de la Crème', url: 'https://cremedelacreme.io', type: 'Freelances sélectionnés' }
            ],
            opportunities: [
                'Contrats long terme sur Malt',
                'Projets bien payés sur Upwork',
                'Clients locaux (PME, artisans)',
                'Sous-traitance agences',
                'Partenariats autres freelances'
            ]
        },
        content: {
            title: 'Créateur de Contenu',
            description: 'Construire une audience et monétiser son contenu',
            duration: '6-12 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '1 mois',
                    tasks: [
                        'Choisir niche (tech, business, lifestyle...)',
                        'Analyser concurrence et tendances',
                        'Définir formats (vidéo, articles, podcast)',
                        'Setup matériel basique',
                        'Planifier contenu (30 jours)'
                    ]
                },
                {
                    name: 'Lancement',
                    duration: '3 mois',
                    tasks: [
                        'Créer comptes réseaux sociaux',
                        'Publier contenu régulièrement (3-7x/semaine)',
                        'Optimiser SEO et découvrabilité',
                        'Engager avec audience',
                        'Analyser métriques'
                    ]
                },
                {
                    name: 'Croissance',
                    duration: '3 mois',
                    tasks: [
                        'Collaborations avec autres créateurs',
                        'Formats viraux (Shorts, Reels)',
                        'Email liste (lead magnets)',
                        'Consistance publication',
                        'Améliorer qualité production'
                    ]
                },
                {
                    name: 'Monétisation',
                    duration: '3+ mois',
                    tasks: [
                        'Affiliation Amazon/programmes',
                        'Sponsorships (marques)',
                        'Produits digitaux (cours, e-books)',
                        'Memberships/Patreon',
                        'Publicités (YouTube, blog)'
                    ]
                }
            ],
            resources: [
                { name: 'YouTube Studio', url: 'https://studio.youtube.com', type: 'Plateforme' },
                { name: 'Canva', url: 'https://www.canva.com', type: 'Design' },
                { name: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com', type: 'Montage vidéo gratuit' },
                { name: 'TubeBuddy', url: 'https://www.tubebuddy.com', type: 'Optimisation YouTube' },
                { name: 'ConvertKit', url: 'https://convertkit.com', type: 'Email marketing' }
            ],
            opportunities: [
                'YouTube Partner Program (1000 abonnés)',
                'Sponsorships marques tech',
                'Affiliation programmes high-ticket',
                'Vente cours en ligne',
                'Speaking events'
            ]
        }
    };
    
    return templates[planType] || templates.programming;
};

// Generate personalized plan based on user data
const generatePlan = async (userData) => {
    const template = loadPlanTemplate(userData.planType);
    
    // Customize plan based on user's specific data
    const customizedPlan = {
        ...template,
        userId: userData.userId,
        personalInfo: {
            name: userData.name,
            age: userData.age,
            education: userData.education,
            field: userData.field,
            experience: userData.experience,
            timePerWeek: userData.timePerWeek,
            budget: userData.budget
        },
        goal: userData.goal,
        timeline: userData.timeline,
        adjustedDuration: adjustDuration(template.duration, userData.timeline),
        tasks: generateTaskList(template.phases, userData),
        milestones: generateMilestones(template.phases),
        visualizations: {
            roadmap: generateRoadmapData(template.phases),
            gantt: generateGanttData(template.phases, userData.timeline)
        },
        recommendations: generateRecommendations(userData),
        generatedAt: new Date().toISOString()
    };
    
    return customizedPlan;
};

// Helper functions
const adjustDuration = (templateDuration, userTimeline) => {
    const mapping = {
        '3months': 'Intensif (3 mois)',
        '6months': 'Standard (6 mois)',
        '1year': 'Progressif (12 mois)',
        '2years': 'Approfondi (24 mois)'
    };
    return mapping[userTimeline] || templateDuration;
};

const generateTaskList = (phases, userData) => {
    const tasks = [];
    let taskId = 1;
    
    phases.forEach((phase, phaseIndex) => {
        phase.tasks.forEach((taskName, taskIndex) => {
            tasks.push({
                id: `task_${taskId}`,
                phaseId: phaseIndex,
                name: taskName,
                phase: phase.name,
                completed: false,
                priority: taskIndex < 2 ? 'high' : 'medium',
                estimatedHours: Math.ceil(Math.random() * 20) + 10
            });
            taskId++;
        });
    });
    
    return tasks;
};

const generateMilestones = (phases) => {
    return phases.map((phase, index) => ({
        id: `milestone_${index + 1}`,
        name: phase.name,
        description: `Compléter la phase ${phase.name}`,
        targetDate: calculateTargetDate(index, phases.length),
        completed: false
    }));
};

const calculateTargetDate = (phaseIndex, totalPhases) => {
    const monthsPerPhase = 12 / totalPhases;
    const targetMonth = Math.ceil((phaseIndex + 1) * monthsPerPhase);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + targetMonth);
    return targetDate.toISOString().split('T')[0];
};

const generateRoadmapData = (phases) => {
    return phases.map((phase, index) => ({
        step: index + 1,
        title: phase.name,
        duration: phase.duration,
        description: phase.tasks.slice(0, 3).join(', '),
        color: ['#0d6efd', '#198754', '#ffc107', '#dc3545'][index % 4]
    }));
};

const generateGanttData = (phases, timeline) => {
    const totalMonths = {
        '3months': 3,
        '6months': 6,
        '1year': 12,
        '2years': 24
    }[timeline] || 12;
    
    let currentMonth = 0;
    return phases.map((phase, index) => {
        const phaseDuration = Math.ceil(totalMonths / phases.length);
        const startMonth = currentMonth;
        currentMonth += phaseDuration;
        
        return {
            id: `phase_${index}`,
            name: phase.name,
            startMonth: startMonth,
            duration: phaseDuration,
            endMonth: Math.min(currentMonth, totalMonths)
        };
    });
};

const generateRecommendations = (userData) => {
    const recommendations = [];
    
    // Budget-based recommendations
    if (userData.budget === '0') {
        recommendations.push({
            type: 'budget',
            title: 'Ressources 100% Gratuites',
            description: 'Concentre-toi sur les ressources gratuites : FreeCodeCamp, YouTube, documentation officielle, GitHub Student Pack.'
        });
    }
    
    // Time-based recommendations
    if (userData.timePerWeek === '5h' || userData.timePerWeek === '10h') {
        recommendations.push({
            type: 'time',
            title: 'Optimise ton Temps',
            description: 'Avec ton temps limité, priorise les tâches essentielles et utilise la technique Pomodoro pour rester focalisé.'
        });
    }
    
    // Experience-based recommendations
    if (userData.experience === 'debutant') {
        recommendations.push({
            type: 'learning',
            title: 'Débutant Complet',
            description: 'Commence par les fondamentaux et ne te précipite pas. La consistance bat l\'intensité sur le long terme.'
        });
    }
    
    // Add opportunity recommendations based on profile
    recommendations.push({
        type: 'opportunities',
        title: 'Opportunités à Explorer',
        description: 'Inscris-toi au PEPITE de ton université et consulte régulièrement Devpost pour les hackathons.'
    });
    
    return recommendations;
};

module.exports = {
    generatePlan,
    loadPlanTemplate
};
