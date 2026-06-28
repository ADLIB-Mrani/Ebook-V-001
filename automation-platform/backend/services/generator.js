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
        },
        datascience: {
            title: 'Maîtriser la Data Science & IA',
            description: 'Devenir Data Scientist ou ML Engineer',
            duration: '8-12 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '2 mois',
                    tasks: [
                        'Python & NumPy/Pandas',
                        'Statistiques fondamentales',
                        'SQL & bases de données',
                        'Jupyter Notebooks'
                    ]
                },
                {
                    name: 'Machine Learning',
                    duration: '3 mois',
                    tasks: [
                        'Scikit-learn',
                        'Algorithmes ML classiques',
                        'Feature engineering',
                        'Kaggle competitions'
                    ]
                },
                {
                    name: 'Deep Learning',
                    duration: '3 mois',
                    tasks: [
                        'TensorFlow/PyTorch',
                        'Réseaux de neurones',
                        'Computer Vision',
                        'NLP fondamentaux'
                    ]
                },
                {
                    name: 'Spécialisation',
                    duration: '2+ mois',
                    tasks: [
                        'MLOps & déploiement',
                        'Projets end-to-end',
                        'Stage/emploi data',
                        'Certifications'
                    ]
                }
            ],
            resources: [
                { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'Cours gratuit' },
                { name: 'Fast.ai', url: 'https://www.fast.ai', type: 'Deep Learning' },
                { name: 'Google Colab', url: 'https://colab.research.google.com', type: 'GPU gratuit' },
                { name: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning', type: 'MOOC' },
                { name: 'Hugging Face', url: 'https://huggingface.co', type: 'NLP/LLM' }
            ],
            opportunities: [
                'Kaggle competitions',
                'AWS ML Scholarship',
                'Google AI Residency',
                'Stage data science',
                'Freelance ML projects'
            ]
        },
        cybersecurity: {
            title: 'Devenir Expert en Cybersécurité',
            description: 'Sécurité informatique et ethical hacking',
            duration: '8-12 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '2 mois',
                    tasks: [
                        'Linux & administration système',
                        'Réseaux (TCP/IP, HTTP)',
                        'Cryptographie bases',
                        'Virtualisation'
                    ]
                },
                {
                    name: 'Offensive Security',
                    duration: '3 mois',
                    tasks: [
                        'OWASP Top 10',
                        'Pentesting web',
                        'Kali Linux',
                        'CTF challenges'
                    ]
                },
                {
                    name: 'Defensive Security',
                    duration: '2 mois',
                    tasks: [
                        'SIEM & monitoring',
                        'Incident response',
                        'Forensics intro',
                        'Compliance (RGPD)'
                    ]
                },
                {
                    name: 'Certifications',
                    duration: '3+ mois',
                    tasks: [
                        'CEH / OSCP prep',
                        'Bug bounty programs',
                        'Stage cybersec',
                        'Portfolio sécu'
                    ]
                }
            ],
            resources: [
                { name: 'TryHackMe', url: 'https://tryhackme.com', type: 'Labs' },
                { name: 'HackTheBox', url: 'https://www.hackthebox.com', type: 'Pentesting' },
                { name: 'Root-Me', url: 'https://www.root-me.org', type: 'Challenges FR' },
                { name: 'OWASP', url: 'https://owasp.org', type: 'Ressources' },
                { name: 'Cybrary', url: 'https://www.cybrary.it', type: 'Cours' }
            ],
            opportunities: [
                'Bug bounty HackerOne',
                'Certifications Security+',
                'CTF competitions',
                'Stage cybersec',
                'Freelance pentesting'
            ]
        },
        ecommerce: {
            title: 'Lancer Son E-commerce',
            description: 'Dropshipping, Amazon FBA ou boutique en ligne',
            duration: '4-8 mois',
            phases: [
                {
                    name: 'Recherche Produit',
                    duration: '1 mois',
                    tasks: [
                        'Niche recherche',
                        'Analyse fournisseurs',
                        'Étude concurrence',
                        'Marge & pricing'
                    ]
                },
                {
                    name: 'Setup Boutique',
                    duration: '1 mois',
                    tasks: [
                        'Shopify/WooCommerce',
                        'Catalogue produits',
                        'Paiements sécurisés',
                        'Conditions légales'
                    ]
                },
                {
                    name: 'Marketing',
                    duration: '2 mois',
                    tasks: [
                        'Facebook/Instagram Ads',
                        'Google Shopping',
                        'SEO e-commerce',
                        'Email marketing'
                    ]
                },
                {
                    name: 'Optimisation',
                    duration: '2+ mois',
                    tasks: [
                        'Conversion rate',
                        'Upselling',
                        'Automatisation',
                        'Scaling'
                    ]
                }
            ],
            resources: [
                { name: 'Shopify', url: 'https://www.shopify.fr', type: 'Plateforme' },
                { name: 'Google Merchant', url: 'https://www.google.com/retail', type: 'Vente' },
                { name: 'Klaviyo', url: 'https://www.klaviyo.com', type: 'Email' },
                { name: 'Oberlo', url: 'https://www.shopify.com/blog/topics/dropshipping', type: 'Dropshipping' }
            ],
            opportunities: [
                'Shopify Partner Program',
                'Amazon Seller Academy',
                'Google Shopping ads',
                'Affiliate marketing'
            ]
        },
        design: {
            title: 'Maîtriser le Design & UX/UI',
            description: 'Graphisme, UI/UX et création visuelle',
            duration: '6-10 mois',
            phases: [
                {
                    name: 'Fondamentaux',
                    duration: '2 mois',
                    tasks: [
                        'Théorie des couleurs',
                        'Typographie',
                        'Composition',
                        'Design thinking'
                    ]
                },
                {
                    name: 'Outils',
                    duration: '2 mois',
                    tasks: [
                        'Figma maîtrise',
                        'Adobe Creative Suite',
                        'Prototypage',
                        'Design systems'
                    ]
                },
                {
                    name: 'Portfolio',
                    duration: '2 mois',
                    tasks: [
                        'Projets UI/UX',
                        'Case studies',
                        'Dribbble/Behance',
                        'Personal branding'
                    ]
                },
                {
                    name: 'Carrière',
                    duration: '2+ mois',
                    tasks: [
                        'Freelance design',
                        'Stage UX/UI',
                        'Design sprints',
                        'Networking'
                    ]
                }
            ],
            resources: [
                { name: 'Figma', url: 'https://www.figma.com', type: 'Outil UI/UX' },
                { name: 'Dribbble', url: 'https://dribbble.com', type: 'Inspiration' },
                { name: 'Laws of UX', url: 'https://lawsofux.com', type: 'Principes' },
                { name: 'Unsplash', url: 'https://unsplash.com', type: 'Photos' }
            ],
            opportunities: [
                'Adobe Creative Residency',
                'Awwwards',
                '99designs contests',
                'Stage UX/UI',
                'Freelance design'
            ]
        },
        marketing: {
            title: 'Maîtriser le Marketing Digital',
            description: 'SEO, publicité et réseaux sociaux',
            duration: '6-10 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '2 mois',
                    tasks: [
                        'Marketing fondamentaux',
                        'Copywriting',
                        'Buyer persona',
                        'Funnel marketing'
                    ]
                },
                {
                    name: 'Canaux',
                    duration: '2 mois',
                    tasks: [
                        'SEO avancé',
                        'Google Ads',
                        'Facebook/Meta Ads',
                        'Email marketing'
                    ]
                },
                {
                    name: 'Analytics',
                    duration: '1 mois',
                    tasks: [
                        'Google Analytics 4',
                        'Data-driven decisions',
                        'A/B testing',
                        'Reporting'
                    ]
                },
                {
                    name: 'Spécialisation',
                    duration: '3+ mois',
                    tasks: [
                        'Growth hacking',
                        'Marketing automation',
                        'Certifications',
                        'Clients/agence'
                    ]
                }
            ],
            resources: [
                { name: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com', type: 'Certif gratuit' },
                { name: 'HubSpot Academy', url: 'https://academy.hubspot.com', type: 'Inbound' },
                { name: 'SEMrush Academy', url: 'https://www.semrush.com/academy', type: 'SEO' },
                { name: 'Mailchimp', url: 'https://mailchimp.com', type: 'Email' }
            ],
            opportunities: [
                'Google Partners Certification',
                'HubSpot Solutions Partner',
                'SEMrush Affiliate',
                'Stage marketing digital'
            ]
        },
        finance: {
            title: 'Maîtriser la Finance & Trading',
            description: 'Investissement, bourse et crypto',
            duration: '6-12 mois',
            phases: [
                {
                    name: 'Éducation Financière',
                    duration: '2 mois',
                    tasks: [
                        'Concepts de base',
                        'Comptabilité',
                        'Marchés financiers',
                        'Gestion budget'
                    ]
                },
                {
                    name: 'Investissement',
                    duration: '2 mois',
                    tasks: [
                        'ETFs et indices',
                        'Actions & analyse',
                        'Portefeuille diversifié',
                        'PEA/Assurance vie'
                    ]
                },
                {
                    name: 'Trading',
                    duration: '2 mois',
                    tasks: [
                        'Analyse technique',
                        'Gestion du risque',
                        'Paper trading',
                        'Psychologie trading'
                    ]
                },
                {
                    name: 'Avancé',
                    duration: '2+ mois',
                    tasks: [
                        'Crypto & DeFi',
                        'Options & dérivés',
                        'Immobilier',
                        'Revenus passifs'
                    ]
                }
            ],
            resources: [
                { name: 'Investopedia', url: 'https://www.investopedia.com', type: 'Éducation' },
                { name: 'TradingView', url: 'https://www.tradingview.com', type: 'Charts' },
                { name: 'Binance Academy', url: 'https://academy.binance.com', type: 'Crypto' },
                { name: 'Finary', url: 'https://finary.com', type: 'Patrimoine' }
            ],
            opportunities: [
                'CFA Scholarship',
                'Stage finance',
                'Quantitative finance',
                'Trading competitions'
            ]
        },
        writing: {
            title: 'Devenir Écrivain & Éditeur',
            description: 'E-books, copywriting et rédaction web',
            duration: '4-8 mois',
            phases: [
                {
                    name: 'Fondations',
                    duration: '1 mois',
                    tasks: [
                        'Style d\'écriture',
                        'Storytelling',
                        'Recherche',
                        'Organisation'
                    ]
                },
                {
                    name: 'Création',
                    duration: '2 mois',
                    tasks: [
                        'Premier e-book',
                        'Blog/Medium',
                        'Newsletter',
                        'Copywriting'
                    ]
                },
                {
                    name: 'Publication',
                    duration: '1 mois',
                    tasks: [
                        'Amazon KDP',
                        'Gumroad/Payhip',
                        'Marketing livres',
                        'Reviews'
                    ]
                },
                {
                    name: 'Scaling',
                    duration: '2+ mois',
                    tasks: [
                        'Série de livres',
                        'Ghostwriting',
                        'Cours écriture',
                        'Communauté'
                    ]
                }
            ],
            resources: [
                { name: 'Amazon KDP', url: 'https://kdp.amazon.com', type: 'Publication' },
                { name: 'Medium', url: 'https://medium.com', type: 'Articles' },
                { name: 'Gumroad', url: 'https://gumroad.com', type: 'Vente' },
                { name: 'Hemingway', url: 'https://hemingwayapp.com', type: 'Édition' }
            ],
            opportunities: [
                'Amazon KDP Select',
                'Medium Partner Program',
                'Prix du Jeune Écrivain',
                'Ghostwriting clients'
            ]
        },
        teaching: {
            title: 'Créateur de Formations',
            description: 'Créer et vendre des cours en ligne',
            duration: '4-8 mois',
            phases: [
                {
                    name: 'Expertise',
                    duration: '1 mois',
                    tasks: [
                        'Définir expertise',
                        'Audience cible',
                        'Programme cours',
                        'Différenciation'
                    ]
                },
                {
                    name: 'Création Cours',
                    duration: '2 mois',
                    tasks: [
                        'Script & structure',
                        'Enregistrement vidéo',
                        'Supports pédagogiques',
                        'Plateforme (Udemy)'
                    ]
                },
                {
                    name: 'Lancement',
                    duration: '1 mois',
                    tasks: [
                        'Prix & positionnement',
                        'Marketing cours',
                        'Premiers étudiants',
                        'Feedback'
                    ]
                },
                {
                    name: 'Expansion',
                    duration: '2+ mois',
                    tasks: [
                        'Coaching 1-to-1',
                        'Communauté payante',
                        'Plus de cours',
                        'Marque personnelle'
                    ]
                }
            ],
            resources: [
                { name: 'Udemy', url: 'https://www.udemy.com/teaching', type: 'Plateforme' },
                { name: 'Teachable', url: 'https://teachable.com', type: 'École en ligne' },
                { name: 'Loom', url: 'https://www.loom.com', type: 'Vidéo' },
                { name: 'Calendly', url: 'https://calendly.com', type: 'RDV' }
            ],
            opportunities: [
                'Udemy Instructor Program',
                'Skillshare Teacher',
                'YouTube Creator Academy',
                'Coaching premium'
            ]
        }
    };
    
    return templates[planType] || templates.programming;
};

// Generate personalized plan based on user data
const { generateAiInsights } = require('./aiProvider');

const generatePlan = async (userData) => {
    const template = loadPlanTemplate(userData.planType);
    
    // Customize plan based on user's specific data
    const aiInsightsResult = await generateAiInsights(userData);

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
        ai: {
            provider: aiInsightsResult.provider,
            insights: aiInsightsResult.insights
        },
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
