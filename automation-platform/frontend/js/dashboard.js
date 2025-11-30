// Constants for plan types and timelines
const PLAN_TYPE_LABELS = {
    'programming': 'Programmation',
    'datascience': 'Data Science & IA',
    'cybersecurity': 'Cybersécurité',
    'business': 'Business & Startup',
    'ecommerce': 'E-commerce',
    'freelancing': 'Freelancing',
    'content': 'Création de Contenu',
    'design': 'Design & UX/UI',
    'marketing': 'Marketing Digital',
    'finance': 'Finance & Trading',
    'writing': 'Écriture & Édition',
    'teaching': 'Formation & Coaching'
};

const TIMELINE_LABELS = {
    '3months': '3 mois',
    '6months': '6 mois',
    '1year': '1 an',
    '2years': '2 ans'
};

// Dashboard initialization
document.addEventListener('DOMContentLoaded', function() {
    // Get user plan from localStorage
    const userPlan = JSON.parse(localStorage.getItem('userPlan'));
    
    if (!userPlan) {
        // Redirect to form if no plan exists
        window.location.href = 'form.html';
        return;
    }
    
    // Populate dashboard
    populateUserInfo(userPlan);
    populateStats(userPlan);
    generateRoadmap(userPlan);
    generateMilestones(userPlan);
    generateResources(userPlan);
    generateOpportunities(userPlan);
    
    // Auto-generate tasks if not already created
    generateAutoTasks(userPlan);
    
    // Generate Gantt chart
    generateGanttChart(userPlan);
    
    // Generate progress charts
    generateProgressCharts(userPlan);
});

function populateUserInfo(plan) {
    document.getElementById('userName').textContent = plan.name;
    const summary = `Plan ${PLAN_TYPE_LABELS[plan.planType]} - ${plan.field}`;
    document.getElementById('planSummary').textContent = summary;
}

function populateStats(plan) {
    // Duration
    document.getElementById('planDuration').textContent = TIMELINE_LABELS[plan.timeline];
    
    // Milestone count (calculated based on plan type)
    const milestoneCount = calculateMilestoneCount(plan);
    document.getElementById('milestoneCount').textContent = milestoneCount;
    
    // Weekly time
    document.getElementById('weeklyTime').textContent = plan.timePerWeek;
    
    // Monthly budget
    document.getElementById('monthlyBudget').textContent = plan.budget === '0' ? 'Gratuit' : `${plan.budget}€`;
}

function calculateMilestoneCount(plan) {
    const timelineMonths = {
        '3months': 3,
        '6months': 6,
        '1year': 12,
        '2years': 24
    };
    
    const months = timelineMonths[plan.timeline];
    // Average 1-2 milestones per month
    return Math.ceil(months * 1.5);
}

function generateRoadmap(plan) {
    const roadmapContent = document.getElementById('roadmapContent');
    const phases = getRoadmapPhases(plan);
    
    let html = '<div class="d-flex flex-wrap gap-3 justify-content-center">';
    
    phases.forEach((phase, index) => {
        html += `
            <div class="roadmap-phase">
                <div class="card border-${phase.color} shadow-sm" style="min-height: 200px;">
                    <div class="card-header bg-${phase.color} text-white">
                        <h6 class="mb-0">
                            <i class="bi bi-${phase.icon}"></i> Phase ${index + 1}
                        </h6>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${phase.title}</h6>
                        <p class="card-text small">${phase.duration}</p>
                        <ul class="small mb-0">
                            ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                ${index < phases.length - 1 ? '<div class="roadmap-arrow"><i class="bi bi-arrow-right"></i></div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    roadmapContent.innerHTML = html;
}

function getRoadmapPhases(plan) {
    const planTypes = {
        'programming': [
            {
                title: 'Fondamentaux',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'book',
                tasks: ['Choisir un langage', 'Syntaxe de base', 'Structures de données', 'Premiers projets']
            },
            {
                title: 'Développement',
                duration: 'Mois 3-4',
                color: 'info',
                icon: 'code-square',
                tasks: ['Projets intermédiaires', 'Git & GitHub', 'APIs & Bases de données', 'Frameworks']
            },
            {
                title: 'Portfolio',
                duration: 'Mois 5-6',
                color: 'success',
                icon: 'briefcase',
                tasks: ['3-5 projets complets', 'Portfolio en ligne', 'GitHub actif', 'Blog technique']
            },
            {
                title: 'Opportunités',
                duration: 'Mois 7+',
                color: 'warning',
                icon: 'lightning',
                tasks: ['Candidatures stage', 'Hackathons', 'Freelance', 'Networking']
            }
        ],
        'datascience': [
            {
                title: 'Fondations',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'calculator',
                tasks: ['Python & NumPy/Pandas', 'Statistiques fondamentales', 'SQL & bases de données', 'Jupyter Notebooks']
            },
            {
                title: 'Machine Learning',
                duration: 'Mois 3-4',
                color: 'info',
                icon: 'robot',
                tasks: ['Scikit-learn', 'Algorithmes ML classiques', 'Feature engineering', 'Kaggle competitions']
            },
            {
                title: 'Deep Learning',
                duration: 'Mois 5-6',
                color: 'success',
                icon: 'diagram-3',
                tasks: ['TensorFlow/PyTorch', 'Réseaux de neurones', 'Computer Vision', 'NLP fondamentaux']
            },
            {
                title: 'Spécialisation',
                duration: 'Mois 7+',
                color: 'warning',
                icon: 'trophy',
                tasks: ['MLOps & déploiement', 'Projets end-to-end', 'Stage/emploi data', 'Certifications']
            }
        ],
        'cybersecurity': [
            {
                title: 'Fondations',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'shield',
                tasks: ['Linux & réseaux', 'Protocoles (TCP/IP, HTTP)', 'Cryptographie bases', 'Virtualisation']
            },
            {
                title: 'Offensive Security',
                duration: 'Mois 3-4',
                color: 'danger',
                icon: 'bug',
                tasks: ['OWASP Top 10', 'Pentesting web', 'Kali Linux', 'CTF challenges']
            },
            {
                title: 'Defensive Security',
                duration: 'Mois 5-6',
                color: 'success',
                icon: 'shield-check',
                tasks: ['SIEM & monitoring', 'Incident response', 'Forensics intro', 'Compliance (RGPD)']
            },
            {
                title: 'Certifications',
                duration: 'Mois 7+',
                color: 'warning',
                icon: 'award',
                tasks: ['CEH / OSCP prep', 'Bug bounty programs', 'Stage cybersec', 'Portfolio sécu']
            }
        ],
        'business': [
            {
                title: 'Idéation',
                duration: 'Mois 1',
                color: 'primary',
                icon: 'lightbulb',
                tasks: ['Trouver une idée', 'Validation marché', 'Étude concurrence', 'Business model']
            },
            {
                title: 'MVP',
                duration: 'Mois 2-3',
                color: 'info',
                icon: 'rocket',
                tasks: ['Développer MVP', 'Tests utilisateurs', 'Premiers clients', 'Feedback']
            },
            {
                title: 'Lancement',
                duration: 'Mois 4-5',
                color: 'success',
                icon: 'graph-up',
                tasks: ['Marketing', 'Réseaux sociaux', 'Croissance', 'Optimisation']
            },
            {
                title: 'Développement',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'trophy',
                tasks: ['Levée de fonds', 'Équipe', 'Scale-up', 'Partenariats']
            }
        ],
        'ecommerce': [
            {
                title: 'Recherche Produit',
                duration: 'Mois 1',
                color: 'primary',
                icon: 'search',
                tasks: ['Niche recherche', 'Analyse fournisseurs', 'Étude concurrence', 'Marge & pricing']
            },
            {
                title: 'Setup Boutique',
                duration: 'Mois 2',
                color: 'info',
                icon: 'shop',
                tasks: ['Shopify/WooCommerce', 'Catalogue produits', 'Paiements sécurisés', 'Conditions légales']
            },
            {
                title: 'Marketing',
                duration: 'Mois 3-4',
                color: 'success',
                icon: 'megaphone',
                tasks: ['Facebook/Instagram Ads', 'Google Shopping', 'SEO e-commerce', 'Email marketing']
            },
            {
                title: 'Optimisation',
                duration: 'Mois 5+',
                color: 'warning',
                icon: 'graph-up-arrow',
                tasks: ['Conversion rate', 'Upselling', 'Automatisation', 'Scaling']
            }
        ],
        'freelancing': [
            {
                title: 'Compétences',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'tools',
                tasks: ['Définir expertise', 'Se former', 'Projets perso', 'Portfolio']
            },
            {
                title: 'Setup',
                duration: 'Mois 3',
                color: 'info',
                icon: 'gear',
                tasks: ['Micro-entreprise', 'Tarifs', 'Contrats', 'Facturation']
            },
            {
                title: 'Clients',
                duration: 'Mois 4-5',
                color: 'success',
                icon: 'people',
                tasks: ['Plateformes', 'Prospection', 'Premiers clients', 'Testimonials']
            },
            {
                title: 'Croissance',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'arrow-up-circle',
                tasks: ['Marketing', 'Réseau', 'Augmenter tarifs', 'Spécialisation']
            }
        ],
        'content': [
            {
                title: 'Niche',
                duration: 'Mois 1',
                color: 'primary',
                icon: 'search',
                tasks: ['Trouver niche', 'Analyse audience', 'Concurrence', 'Style unique']
            },
            {
                title: 'Production',
                duration: 'Mois 2-3',
                color: 'info',
                icon: 'camera-video',
                tasks: ['Équipement', 'Premiers contenus', 'Qualité', 'Régularité']
            },
            {
                title: 'Croissance',
                duration: 'Mois 4-5',
                color: 'success',
                icon: 'graph-up-arrow',
                tasks: ['SEO/Algo', 'Engagement', '1000 abonnés', 'Collaborations']
            },
            {
                title: 'Monétisation',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'cash-coin',
                tasks: ['Partenariats', 'Sponsoring', 'Produits', 'Communauté']
            }
        ],
        'design': [
            {
                title: 'Fondamentaux',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'palette',
                tasks: ['Théorie des couleurs', 'Typographie', 'Composition', 'Design thinking']
            },
            {
                title: 'Outils',
                duration: 'Mois 3',
                color: 'info',
                icon: 'tools',
                tasks: ['Figma maîtrise', 'Adobe Creative Suite', 'Prototypage', 'Design systems']
            },
            {
                title: 'Portfolio',
                duration: 'Mois 4-5',
                color: 'success',
                icon: 'collection',
                tasks: ['Projets UI/UX', 'Case studies', 'Dribbble/Behance', 'Personal branding']
            },
            {
                title: 'Carrière',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'briefcase',
                tasks: ['Freelance design', 'Stage UX/UI', 'Design sprints', 'Networking']
            }
        ],
        'marketing': [
            {
                title: 'Fondations',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'book',
                tasks: ['Marketing fondamentaux', 'Copywriting', 'Buyer persona', 'Funnel marketing']
            },
            {
                title: 'Canaux',
                duration: 'Mois 3-4',
                color: 'info',
                icon: 'broadcast',
                tasks: ['SEO avancé', 'Google Ads', 'Facebook/Meta Ads', 'Email marketing']
            },
            {
                title: 'Analytics',
                duration: 'Mois 5',
                color: 'success',
                icon: 'graph-up',
                tasks: ['Google Analytics 4', 'Data-driven decisions', 'A/B testing', 'Reporting']
            },
            {
                title: 'Spécialisation',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'target',
                tasks: ['Growth hacking', 'Marketing automation', 'Certifications', 'Clients/agence']
            }
        ],
        'finance': [
            {
                title: 'Éducation Financière',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'book',
                tasks: ['Concepts de base', 'Comptabilité', 'Marchés financiers', 'Gestion budget']
            },
            {
                title: 'Investissement',
                duration: 'Mois 3-4',
                color: 'info',
                icon: 'piggy-bank',
                tasks: ['ETFs et indices', 'Actions & analyse', 'Portefeuille diversifié', 'PEA/Assurance vie']
            },
            {
                title: 'Trading',
                duration: 'Mois 5-6',
                color: 'success',
                icon: 'graph-up-arrow',
                tasks: ['Analyse technique', 'Gestion du risque', 'Paper trading', 'Psychologie trading']
            },
            {
                title: 'Avancé',
                duration: 'Mois 7+',
                color: 'warning',
                icon: 'currency-bitcoin',
                tasks: ['Crypto & DeFi', 'Options & dérivés', 'Immobilier', 'Revenus passifs']
            }
        ],
        'writing': [
            {
                title: 'Fondations',
                duration: 'Mois 1',
                color: 'primary',
                icon: 'pencil',
                tasks: ['Style d\'écriture', 'Storytelling', 'Recherche', 'Organisation']
            },
            {
                title: 'Création',
                duration: 'Mois 2-3',
                color: 'info',
                icon: 'book',
                tasks: ['Premier e-book', 'Blog/Medium', 'Newsletter', 'Copywriting']
            },
            {
                title: 'Publication',
                duration: 'Mois 4-5',
                color: 'success',
                icon: 'upload',
                tasks: ['Amazon KDP', 'Gumroad/Payhip', 'Marketing livres', 'Reviews']
            },
            {
                title: 'Scaling',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'stack',
                tasks: ['Série de livres', 'Ghostwriting', 'Cours écriture', 'Communauté']
            }
        ],
        'teaching': [
            {
                title: 'Expertise',
                duration: 'Mois 1-2',
                color: 'primary',
                icon: 'lightbulb',
                tasks: ['Définir expertise', 'Audience cible', 'Programme cours', 'Différenciation']
            },
            {
                title: 'Création Cours',
                duration: 'Mois 3-4',
                color: 'info',
                icon: 'camera-video',
                tasks: ['Script & structure', 'Enregistrement vidéo', 'Supports pédagogiques', 'Plateforme (Udemy)']
            },
            {
                title: 'Lancement',
                duration: 'Mois 5',
                color: 'success',
                icon: 'rocket',
                tasks: ['Prix & positionnement', 'Marketing cours', 'Premiers étudiants', 'Feedback']
            },
            {
                title: 'Expansion',
                duration: 'Mois 6+',
                color: 'warning',
                icon: 'mortarboard',
                tasks: ['Coaching 1-to-1', 'Communauté payante', 'Plus de cours', 'Marque personnelle']
            }
        ]
    };
    
    return planTypes[plan.planType] || planTypes['programming'];
}

function generateMilestones(plan) {
    const milestonesContent = document.getElementById('milestonesContent');
    const milestones = getMilestones(plan);
    
    let html = '<div class="row g-3">';
    
    milestones.forEach((milestone, index) => {
        const isCompleted = index === 0; // First milestone is pre-completed
        html += `
            <div class="col-12">
                <div class="milestone-item">
                    <div class="milestone-dot ${isCompleted ? 'completed' : ''}"></div>
                    <div class="card task-item ${isCompleted ? 'completed' : ''}">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <h6 class="mb-1">${milestone.title}</h6>
                                    <p class="text-muted small mb-0">${milestone.description}</p>
                                </div>
                                <div class="col-md-4 text-md-end mt-2 mt-md-0">
                                    <span class="badge bg-secondary">${milestone.timeline}</span>
                                    ${isCompleted ? '<span class="badge bg-success ms-2"><i class="bi bi-check"></i> Complété</span>' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    milestonesContent.innerHTML = html;
}

function getMilestones(plan) {
    const baseMilestones = [
        {
            title: 'Inscription complétée',
            description: 'Tu as créé ton plan personnalisé et défini tes objectifs',
            timeline: 'Aujourd\'hui'
        },
        {
            title: 'Configuration initiale',
            description: 'Configurer ton environnement de travail et outils nécessaires',
            timeline: 'Semaine 1'
        },
        {
            title: 'Première étape terminée',
            description: 'Compléter la première phase de ton plan',
            timeline: 'Mois 1'
        }
    ];
    
    const planSpecificMilestones = {
        'programming': [
            { title: 'Premier projet GitHub', description: 'Publier ton premier projet complet sur GitHub', timeline: 'Mois 2' },
            { title: 'Portfolio en ligne', description: 'Créer et déployer ton portfolio professionnel', timeline: 'Mois 3-4' },
            { title: 'Premier stage/job', description: 'Décrocher ton premier stage ou mission', timeline: 'Mois 5-6' }
        ],
        'datascience': [
            { title: 'Premier notebook Kaggle', description: 'Publier ton premier notebook avec analyse complète', timeline: 'Mois 2' },
            { title: 'Première compétition Kaggle', description: 'Participer à une compétition ML', timeline: 'Mois 3-4' },
            { title: 'Projet ML déployé', description: 'Déployer un modèle ML en production', timeline: 'Mois 5-6' }
        ],
        'cybersecurity': [
            { title: 'Première certification', description: 'Obtenir une certification de base (ex: Security+)', timeline: 'Mois 2-3' },
            { title: '50 challenges CTF', description: 'Compléter 50 challenges sur TryHackMe/HackTheBox', timeline: 'Mois 4' },
            { title: 'Premier bug bounty', description: 'Soumettre ta première vulnérabilité', timeline: 'Mois 5-6' }
        ],
        'business': [
            { title: 'MVP lancé', description: 'Lancer ton MVP et obtenir les premiers retours', timeline: 'Mois 2-3' },
            { title: 'Premiers clients', description: 'Acquérir tes 10 premiers clients', timeline: 'Mois 4' },
            { title: 'Rentabilité', description: 'Atteindre le seuil de rentabilité', timeline: 'Mois 6' }
        ],
        'ecommerce': [
            { title: 'Boutique en ligne', description: 'Lancer ta première boutique e-commerce', timeline: 'Mois 2' },
            { title: '100 premières ventes', description: 'Réaliser tes 100 premières ventes', timeline: 'Mois 3-4' },
            { title: '1000€/mois', description: 'Atteindre 1000€ de CA mensuel', timeline: 'Mois 5-6' }
        ],
        'freelancing': [
            { title: 'Micro-entreprise créée', description: 'Finaliser ta micro-entreprise et setup administratif', timeline: 'Mois 2' },
            { title: 'Premier client', description: 'Décrocher ta première mission freelance', timeline: 'Mois 3-4' },
            { title: '5 missions complétées', description: 'Compléter 5 missions et avoir des témoignages', timeline: 'Mois 6' }
        ],
        'content': [
            { title: '10 contenus publiés', description: 'Publier régulièrement et trouver ton rythme', timeline: 'Mois 2' },
            { title: '1000 abonnés', description: 'Atteindre ton premier millier d\'abonnés', timeline: 'Mois 4-5' },
            { title: 'Première monétisation', description: 'Gagner tes premiers revenus du contenu', timeline: 'Mois 6' }
        ],
        'design': [
            { title: 'Portfolio Dribbble/Behance', description: 'Créer ton portfolio avec 5+ projets', timeline: 'Mois 2-3' },
            { title: 'Première commande client', description: 'Décrocher ta première mission design', timeline: 'Mois 4' },
            { title: 'Spécialisation UI/UX', description: 'Te positionner comme expert dans une niche', timeline: 'Mois 5-6' }
        ],
        'marketing': [
            { title: 'Certifications Google', description: 'Obtenir Google Ads et Analytics certifications', timeline: 'Mois 2' },
            { title: 'Première campagne réussie', description: 'Lancer une campagne avec ROI positif', timeline: 'Mois 3-4' },
            { title: 'Client régulier', description: 'Avoir un client en contrat mensuel', timeline: 'Mois 5-6' }
        ],
        'finance': [
            { title: 'Premier investissement', description: 'Ouvrir PEA/CTO et faire premier achat', timeline: 'Mois 1-2' },
            { title: 'Portefeuille diversifié', description: 'Construire un portefeuille équilibré', timeline: 'Mois 3-4' },
            { title: 'Premiers revenus passifs', description: 'Recevoir premiers dividendes/intérêts', timeline: 'Mois 6' }
        ],
        'writing': [
            { title: 'Premier e-book publié', description: 'Publier ton premier e-book sur Amazon KDP', timeline: 'Mois 2-3' },
            { title: '10 premières ventes', description: 'Vendre tes 10 premiers exemplaires', timeline: 'Mois 4' },
            { title: 'Newsletter 100 abonnés', description: 'Construire une audience fidèle', timeline: 'Mois 5-6' }
        ],
        'teaching': [
            { title: 'Premier cours publié', description: 'Publier ton premier cours sur Udemy/Teachable', timeline: 'Mois 3-4' },
            { title: '50 étudiants', description: 'Atteindre 50 étudiants inscrits', timeline: 'Mois 5' },
            { title: 'Notes 4.5+', description: 'Maintenir une note moyenne de 4.5+', timeline: 'Mois 6' }
        ]
    };
    
    return [...baseMilestones, ...(planSpecificMilestones[plan.planType] || planSpecificMilestones['programming'])];
}

function generateResources(plan) {
    const resourcesContent = document.getElementById('resourcesContent');
    const resources = getResources(plan);
    
    let html = '<div class="row g-3">';
    
    Object.keys(resources).forEach(category => {
        html += `
            <div class="col-12">
                <h6 class="text-primary"><i class="bi bi-bookmark-star"></i> ${category}</h6>
                <div class="row g-3 mb-4">
        `;
        
        resources[category].forEach(resource => {
            html += `
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h6 class="card-title">${resource.name}</h6>
                            <p class="card-text small text-muted">${resource.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-${resource.type === 'gratuit' ? 'success' : 'warning'}">${resource.type}</span>
                                <a href="${resource.link}" target="_blank" class="btn btn-sm btn-outline-primary">
                                    Accéder <i class="bi bi-box-arrow-up-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resourcesContent.innerHTML = html;
}

function getResources(plan) {
    const resourcesByPlan = {
        'programming': {
            'Apprentissage - Cours Gratuits': [
                { name: 'freeCodeCamp', description: 'Cours complets de programmation, entièrement gratuit avec certifications', type: 'gratuit', link: 'https://www.freecodecamp.org/' },
                { name: 'The Odin Project', description: 'Curriculum complet pour devenir développeur web full-stack', type: 'gratuit', link: 'https://www.theodinproject.com/' },
                { name: 'MDN Web Docs', description: 'Documentation complète pour le développement web par Mozilla', type: 'gratuit', link: 'https://developer.mozilla.org/' },
                { name: 'CS50 Harvard', description: 'Meilleur cours d\'introduction à l\'informatique au monde', type: 'gratuit', link: 'https://cs50.harvard.edu/' },
                { name: 'Codecademy', description: 'Plateforme interactive pour apprendre à coder', type: 'freemium', link: 'https://www.codecademy.com/' },
                { name: 'Khan Academy', description: 'Informatique et programmation gratuit', type: 'gratuit', link: 'https://www.khanacademy.org/computing' }
            ],
            'Outils de Développement': [
                { name: 'VS Code', description: 'Éditeur de code gratuit et puissant par Microsoft', type: 'gratuit', link: 'https://code.visualstudio.com/' },
                { name: 'GitHub', description: 'Hébergement de code, versioning et portfolio', type: 'gratuit', link: 'https://github.com/' },
                { name: 'GitHub Student Pack', description: '200K$ d\'outils gratuits pour étudiants', type: 'gratuit', link: 'https://education.github.com/pack' },
                { name: 'JetBrains Student', description: 'IDEs professionnels gratuits pour étudiants', type: 'gratuit', link: 'https://www.jetbrains.com/student/' },
                { name: 'Replit', description: 'IDE en ligne pour coder depuis n\'importe où', type: 'freemium', link: 'https://replit.com/' },
                { name: 'CodePen', description: 'Playground pour HTML/CSS/JS', type: 'freemium', link: 'https://codepen.io/' }
            ],
            'Pratique et Exercices': [
                { name: 'LeetCode', description: 'Problèmes d\'algorithmes pour entretiens tech', type: 'freemium', link: 'https://leetcode.com/' },
                { name: 'Exercism', description: 'Exercices de code avec mentorat gratuit', type: 'gratuit', link: 'https://exercism.org/' },
                { name: 'HackerRank', description: 'Challenges de programmation et certifications', type: 'gratuit', link: 'https://www.hackerrank.com/' },
                { name: 'Codewars', description: 'Katas de code pour progresser', type: 'gratuit', link: 'https://www.codewars.com/' }
            ],
            'Communautés': [
                { name: 'Stack Overflow', description: 'Q&A pour développeurs', type: 'gratuit', link: 'https://stackoverflow.com/' },
                { name: 'Dev.to', description: 'Communauté de développeurs et articles', type: 'gratuit', link: 'https://dev.to/' },
                { name: 'Discord Grafikart', description: 'Communauté francophone de développeurs', type: 'gratuit', link: 'https://discord.gg/grafikart' }
            ]
        },
        'datascience': {
            'Cours et Certifications': [
                { name: 'Kaggle Learn', description: 'Micro-cours gratuits en data science et ML', type: 'gratuit', link: 'https://www.kaggle.com/learn' },
                { name: 'Google ML Crash Course', description: 'Introduction au Machine Learning par Google', type: 'gratuit', link: 'https://developers.google.com/machine-learning/crash-course' },
                { name: 'Fast.ai', description: 'Deep Learning pratique et gratuit', type: 'gratuit', link: 'https://www.fast.ai/' },
                { name: 'DataCamp', description: 'Cours interactifs de data science', type: 'freemium', link: 'https://www.datacamp.com/' },
                { name: 'Coursera - Andrew Ng', description: 'Cours ML de Stanford (audit gratuit)', type: 'freemium', link: 'https://www.coursera.org/learn/machine-learning' },
                { name: 'StatQuest', description: 'Statistiques et ML expliqués simplement', type: 'gratuit', link: 'https://www.youtube.com/c/joshstarmer' }
            ],
            'Outils et Plateformes': [
                { name: 'Google Colab', description: 'Notebooks Jupyter gratuits avec GPU', type: 'gratuit', link: 'https://colab.research.google.com/' },
                { name: 'Kaggle Notebooks', description: 'Environnement ML gratuit avec datasets', type: 'gratuit', link: 'https://www.kaggle.com/code' },
                { name: 'Hugging Face', description: 'Modèles NLP et ML pré-entraînés', type: 'gratuit', link: 'https://huggingface.co/' },
                { name: 'Weights & Biases', description: 'MLOps et tracking d\'expériences', type: 'freemium', link: 'https://wandb.ai/' }
            ],
            'Compétitions et Pratique': [
                { name: 'Kaggle Competitions', description: 'Compétitions ML avec prix', type: 'gratuit', link: 'https://www.kaggle.com/competitions' },
                { name: 'DrivenData', description: 'Data science pour le bien social', type: 'gratuit', link: 'https://www.drivendata.org/' },
                { name: 'UCI ML Repository', description: 'Datasets classiques pour ML', type: 'gratuit', link: 'https://archive.ics.uci.edu/ml/index.php' }
            ],
            'Ressources Avancées': [
                { name: 'Papers With Code', description: 'Papers ML avec code source', type: 'gratuit', link: 'https://paperswithcode.com/' },
                { name: 'Towards Data Science', description: 'Articles et tutoriels data science', type: 'gratuit', link: 'https://towardsdatascience.com/' },
                { name: 'AWS/GCP Credits étudiants', description: 'Crédits cloud gratuits pour ML', type: 'gratuit', link: 'https://aws.amazon.com/education/' }
            ]
        },
        'cybersecurity': {
            'Apprentissage et CTF': [
                { name: 'TryHackMe', description: 'Plateforme d\'apprentissage cybersec interactive', type: 'freemium', link: 'https://tryhackme.com/' },
                { name: 'HackTheBox', description: 'Labs de pentesting et challenges', type: 'freemium', link: 'https://www.hackthebox.com/' },
                { name: 'PicoCTF', description: 'CTF éducatif par Carnegie Mellon', type: 'gratuit', link: 'https://picoctf.org/' },
                { name: 'OverTheWire', description: 'Wargames pour apprendre Linux et sécu', type: 'gratuit', link: 'https://overthewire.org/' },
                { name: 'Root-Me', description: 'Plateforme française de challenges', type: 'gratuit', link: 'https://www.root-me.org/' },
                { name: 'CyberDefenders', description: 'Blue team et forensics labs', type: 'gratuit', link: 'https://cyberdefenders.org/' }
            ],
            'Certifications et Cours': [
                { name: 'OWASP', description: 'Ressources sécurité web (Top 10)', type: 'gratuit', link: 'https://owasp.org/' },
                { name: 'Cybrary', description: 'Cours cybersec gratuits', type: 'freemium', link: 'https://www.cybrary.it/' },
                { name: 'CompTIA Security+', description: 'Certification cybersec de base', type: 'payant', link: 'https://www.comptia.org/certifications/security' },
                { name: 'eLearnSecurity', description: 'Formations pentesting pratiques', type: 'payant', link: 'https://elearnsecurity.com/' }
            ],
            'Outils': [
                { name: 'Kali Linux', description: 'Distribution Linux pour pentesting', type: 'gratuit', link: 'https://www.kali.org/' },
                { name: 'Burp Suite Community', description: 'Proxy pour tests sécurité web', type: 'gratuit', link: 'https://portswigger.net/burp/communitydownload' },
                { name: 'Wireshark', description: 'Analyse de paquets réseau', type: 'gratuit', link: 'https://www.wireshark.org/' },
                { name: 'OWASP ZAP', description: 'Scanner de vulnérabilités web', type: 'gratuit', link: 'https://www.zaproxy.org/' }
            ],
            'Bug Bounty': [
                { name: 'HackerOne', description: 'Plateforme bug bounty leader', type: 'gratuit', link: 'https://www.hackerone.com/' },
                { name: 'Bugcrowd', description: 'Bug bounty et pen testing', type: 'gratuit', link: 'https://www.bugcrowd.com/' },
                { name: 'YesWeHack', description: 'Bug bounty européen', type: 'gratuit', link: 'https://www.yeswehack.com/' }
            ]
        },
        'business': {
            'Création d\'Entreprise': [
                { name: 'PEPITE', description: 'Statut étudiant entrepreneur en France', type: 'gratuit', link: 'https://www.pepite-france.fr/' },
                { name: 'BPI France Création', description: 'Ressources et guides pour entrepreneurs', type: 'gratuit', link: 'https://bpifrance-creation.fr/' },
                { name: 'Autoentrepreneur URSSAF', description: 'Créer sa micro-entreprise', type: 'gratuit', link: 'https://www.autoentrepreneur.urssaf.fr/' },
                { name: 'Legalstart', description: 'Création d\'entreprise simplifiée', type: 'freemium', link: 'https://www.legalstart.fr/' }
            ],
            'Formation Business': [
                { name: 'Y Combinator Startup School', description: 'Formation startup gratuite par YC', type: 'gratuit', link: 'https://www.startupschool.org/' },
                { name: 'Google Ateliers Numériques', description: 'Marketing digital certifié', type: 'gratuit', link: 'https://learndigital.withgoogle.com/' },
                { name: 'HubSpot Academy', description: 'Cours marketing et ventes gratuits', type: 'gratuit', link: 'https://academy.hubspot.com/' },
                { name: 'Notion Templates', description: 'Templates business gratuits', type: 'gratuit', link: 'https://www.notion.so/templates' }
            ],
            'Financement': [
                { name: 'Station F', description: 'Campus startup et programmes', type: 'gratuit', link: 'https://stationf.co/' },
                { name: 'French Tech', description: 'Écosystème startup français', type: 'gratuit', link: 'https://lafrenchtech.com/' },
                { name: 'Bourse French Tech', description: 'Financement early stage', type: 'gratuit', link: 'https://www.bpifrance.fr/Toutes-nos-solutions/Aides-concours-et-டlabels/Bourses-French-Tech' },
                { name: 'Prêt Étudiant Garanti', description: 'Jusqu\'à 20 000€ sans caution', type: 'gratuit', link: 'https://www.etudiant.gouv.fr/fr/le-pret-etudiant-garanti-par-l-etat-1519' }
            ],
            'Outils Startup': [
                { name: 'Stripe Atlas', description: 'Créer une LLC américaine', type: 'payant', link: 'https://stripe.com/atlas' },
                { name: 'Product Hunt', description: 'Lancer son produit', type: 'gratuit', link: 'https://www.producthunt.com/' },
                { name: 'Indie Hackers', description: 'Communauté d\'entrepreneurs solo', type: 'gratuit', link: 'https://www.indiehackers.com/' }
            ]
        },
        'ecommerce': {
            'Plateformes E-commerce': [
                { name: 'Shopify', description: 'Plateforme e-commerce leader (14 jours gratuit)', type: 'payant', link: 'https://www.shopify.fr/' },
                { name: 'WooCommerce', description: 'E-commerce WordPress gratuit', type: 'gratuit', link: 'https://woocommerce.com/' },
                { name: 'Prestashop', description: 'Solution française open source', type: 'gratuit', link: 'https://www.prestashop.com/' },
                { name: 'Wix eCommerce', description: 'Solution simple pour débuter', type: 'freemium', link: 'https://www.wix.com/ecommerce' }
            ],
            'Dropshipping et Fournisseurs': [
                { name: 'AliExpress', description: 'Fournisseurs dropshipping', type: 'gratuit', link: 'https://www.aliexpress.com/' },
                { name: 'DSers', description: 'Gestion dropshipping AliExpress', type: 'freemium', link: 'https://www.dsers.com/' },
                { name: 'Spocket', description: 'Fournisseurs US/EU pour dropshipping', type: 'freemium', link: 'https://www.spocket.co/' },
                { name: 'BigBuy', description: 'Dropshipping européen', type: 'payant', link: 'https://www.bigbuy.eu/' }
            ],
            'Marketing E-commerce': [
                { name: 'Klaviyo', description: 'Email marketing e-commerce', type: 'freemium', link: 'https://www.klaviyo.com/' },
                { name: 'Google Merchant Center', description: 'Google Shopping gratuit', type: 'gratuit', link: 'https://www.google.com/retail/solutions/merchant-center/' },
                { name: 'Facebook Business Suite', description: 'Publicité FB/Instagram', type: 'gratuit', link: 'https://business.facebook.com/' },
                { name: 'Loox', description: 'Reviews photos pour Shopify', type: 'freemium', link: 'https://loox.app/' }
            ],
            'Analytics et Optimisation': [
                { name: 'Hotjar', description: 'Heatmaps et recordings (gratuit limité)', type: 'freemium', link: 'https://www.hotjar.com/' },
                { name: 'Google Analytics', description: 'Analytics e-commerce', type: 'gratuit', link: 'https://analytics.google.com/' },
                { name: 'Jungle Scout', description: 'Recherche produits Amazon', type: 'payant', link: 'https://www.junglescout.com/' }
            ]
        },
        'freelancing': {
            'Plateformes Freelance': [
                { name: 'Malt', description: 'Plateforme freelance française #1', type: 'gratuit', link: 'https://www.malt.fr/' },
                { name: 'Upwork', description: 'Plateforme internationale leader', type: 'gratuit', link: 'https://www.upwork.com/' },
                { name: 'Fiverr', description: 'Micro-services et gigs', type: 'gratuit', link: 'https://www.fiverr.com/' },
                { name: 'ComeUp', description: 'Freelance français (ex 5euros)', type: 'gratuit', link: 'https://comeup.com/' },
                { name: 'Crème de la Crème', description: 'Freelances sélectionnés', type: 'gratuit', link: 'https://cremedelacreme.io/' },
                { name: 'Toptal', description: 'Top 3% des freelances', type: 'gratuit', link: 'https://www.toptal.com/' }
            ],
            'Gestion et Admin': [
                { name: 'Freebe', description: 'Facturation auto-entrepreneur', type: 'freemium', link: 'https://www.freebe.me/' },
                { name: 'Henrri', description: 'Facturation 100% gratuite', type: 'gratuit', link: 'https://www.henrri.net/' },
                { name: 'Notion', description: 'Gestion projets et CRM freelance', type: 'gratuit', link: 'https://www.notion.so/' },
                { name: 'Toggl', description: 'Time tracking gratuit', type: 'freemium', link: 'https://toggl.com/' }
            ],
            'Contrats et Légal': [
                { name: 'Rocket Lawyer', description: 'Contrats types freelance', type: 'freemium', link: 'https://www.rocketlawyer.com/' },
                { name: 'URSSAF', description: 'Cotisations et déclarations', type: 'gratuit', link: 'https://www.autoentrepreneur.urssaf.fr/' },
                { name: 'Shine', description: 'Compte pro et admin freelance', type: 'payant', link: 'https://www.shine.fr/' }
            ],
            'Marketing Personnel': [
                { name: 'LinkedIn', description: 'Networking et personal branding', type: 'gratuit', link: 'https://www.linkedin.com/' },
                { name: 'Behance', description: 'Portfolio créatif', type: 'gratuit', link: 'https://www.behance.net/' },
                { name: 'Calendly', description: 'Prise de RDV automatisée', type: 'freemium', link: 'https://calendly.com/' }
            ]
        },
        'content': {
            'Plateformes de Diffusion': [
                { name: 'YouTube', description: 'Plateforme vidéo #1 mondiale', type: 'gratuit', link: 'https://www.youtube.com/' },
                { name: 'TikTok', description: 'Vidéos courtes virales', type: 'gratuit', link: 'https://www.tiktok.com/' },
                { name: 'Medium', description: 'Plateforme d\'articles avec revenus', type: 'gratuit', link: 'https://medium.com/' },
                { name: 'Substack', description: 'Newsletter payante', type: 'gratuit', link: 'https://substack.com/' },
                { name: 'Twitch', description: 'Streaming live gaming/tech', type: 'gratuit', link: 'https://www.twitch.tv/' },
                { name: 'Anchor', description: 'Podcast gratuit (Spotify)', type: 'gratuit', link: 'https://anchor.fm/' }
            ],
            'Création et Montage': [
                { name: 'DaVinci Resolve', description: 'Montage vidéo pro 100% gratuit', type: 'gratuit', link: 'https://www.blackmagicdesign.com/products/davinciresolve/' },
                { name: 'Canva', description: 'Design graphique et miniatures', type: 'freemium', link: 'https://www.canva.com/' },
                { name: 'CapCut', description: 'Montage vidéo mobile gratuit', type: 'gratuit', link: 'https://www.capcut.com/' },
                { name: 'OBS Studio', description: 'Streaming et enregistrement', type: 'gratuit', link: 'https://obsproject.com/' },
                { name: 'Audacity', description: 'Édition audio gratuite', type: 'gratuit', link: 'https://www.audacityteam.org/' }
            ],
            'Optimisation et Analytics': [
                { name: 'TubeBuddy', description: 'Optimisation YouTube SEO', type: 'freemium', link: 'https://www.tubebuddy.com/' },
                { name: 'VidIQ', description: 'Analytics YouTube avancé', type: 'freemium', link: 'https://vidiq.com/' },
                { name: 'Social Blade', description: 'Stats réseaux sociaux', type: 'gratuit', link: 'https://socialblade.com/' },
                { name: 'Later', description: 'Planification réseaux sociaux', type: 'freemium', link: 'https://later.com/' }
            ],
            'Monétisation': [
                { name: 'Patreon', description: 'Abonnements créateurs', type: 'gratuit', link: 'https://www.patreon.com/' },
                { name: 'Ko-fi', description: 'Tips et supports fans', type: 'gratuit', link: 'https://ko-fi.com/' },
                { name: 'Gumroad', description: 'Vente produits digitaux', type: 'gratuit', link: 'https://gumroad.com/' }
            ]
        },
        'design': {
            'Outils de Design': [
                { name: 'Figma', description: 'Design UI/UX collaboratif (gratuit pour étudiants)', type: 'freemium', link: 'https://www.figma.com/' },
                { name: 'Canva', description: 'Design graphique accessible', type: 'freemium', link: 'https://www.canva.com/' },
                { name: 'Adobe Creative Cloud', description: 'Suite complète (60% réduction étudiants)', type: 'payant', link: 'https://www.adobe.com/fr/creativecloud/plans.html?promoid=P3KMQYMW&mv=other' },
                { name: 'Sketch', description: 'Design UI pour Mac (50% réduction étudiants)', type: 'payant', link: 'https://www.sketch.com/' },
                { name: 'Penpot', description: 'Alternative Figma open source', type: 'gratuit', link: 'https://penpot.app/' },
                { name: 'InVision', description: 'Prototypage et collaboration', type: 'freemium', link: 'https://www.invisionapp.com/' }
            ],
            'Ressources et Assets': [
                { name: 'Unsplash', description: 'Photos HD libres de droits', type: 'gratuit', link: 'https://unsplash.com/' },
                { name: 'Pexels', description: 'Photos et vidéos gratuites', type: 'gratuit', link: 'https://www.pexels.com/' },
                { name: 'unDraw', description: 'Illustrations SVG personnalisables', type: 'gratuit', link: 'https://undraw.co/' },
                { name: 'Flaticon', description: 'Icônes gratuites', type: 'freemium', link: 'https://www.flaticon.com/' },
                { name: 'Google Fonts', description: 'Polices gratuites', type: 'gratuit', link: 'https://fonts.google.com/' },
                { name: 'Coolors', description: 'Générateur de palettes couleurs', type: 'gratuit', link: 'https://coolors.co/' }
            ],
            'Apprentissage UI/UX': [
                { name: 'UX Design Institute', description: 'Cours UX professionnels', type: 'payant', link: 'https://www.uxdesigninstitute.com/' },
                { name: 'Interaction Design Foundation', description: 'Cours UX abordables', type: 'payant', link: 'https://www.interaction-design.org/' },
                { name: 'Refactoring UI', description: 'Conseils UI pratiques', type: 'freemium', link: 'https://www.refactoringui.com/' },
                { name: 'Laws of UX', description: 'Principes UX essentiels', type: 'gratuit', link: 'https://lawsofux.com/' }
            ],
            'Portfolios et Inspiration': [
                { name: 'Dribbble', description: 'Inspiration design et portfolio', type: 'freemium', link: 'https://dribbble.com/' },
                { name: 'Behance', description: 'Portfolio créatif par Adobe', type: 'gratuit', link: 'https://www.behance.net/' },
                { name: 'Awwwards', description: 'Meilleurs sites web du monde', type: 'gratuit', link: 'https://www.awwwards.com/' }
            ]
        },
        'marketing': {
            'Formation Marketing': [
                { name: 'Google Digital Garage', description: 'Certification marketing digital gratuite', type: 'gratuit', link: 'https://learndigital.withgoogle.com/' },
                { name: 'HubSpot Academy', description: 'Inbound marketing certifié', type: 'gratuit', link: 'https://academy.hubspot.com/' },
                { name: 'Facebook Blueprint', description: 'Formation publicité Meta', type: 'gratuit', link: 'https://www.facebook.com/business/learn' },
                { name: 'Google Skillshop', description: 'Certification Google Ads', type: 'gratuit', link: 'https://skillshop.withgoogle.com/' },
                { name: 'SEMrush Academy', description: 'Cours SEO et content marketing', type: 'gratuit', link: 'https://www.semrush.com/academy/' },
                { name: 'Ahrefs Academy', description: 'Formation SEO avancée', type: 'gratuit', link: 'https://ahrefs.com/academy' }
            ],
            'Outils SEO': [
                { name: 'Ubersuggest', description: 'Recherche mots-clés gratuite', type: 'freemium', link: 'https://neilpatel.com/ubersuggest/' },
                { name: 'Google Search Console', description: 'Analytics SEO par Google', type: 'gratuit', link: 'https://search.google.com/search-console' },
                { name: 'Screaming Frog', description: 'Audit SEO technique (500 URLs gratuit)', type: 'freemium', link: 'https://www.screamingfrog.co.uk/' },
                { name: 'AnswerThePublic', description: 'Idées de contenu SEO', type: 'freemium', link: 'https://answerthepublic.com/' }
            ],
            'Email Marketing': [
                { name: 'Mailchimp', description: 'Email marketing (500 contacts gratuit)', type: 'freemium', link: 'https://mailchimp.com/' },
                { name: 'Sendinblue', description: 'Email + SMS marketing français', type: 'freemium', link: 'https://www.brevo.com/' },
                { name: 'ConvertKit', description: 'Email pour créateurs', type: 'freemium', link: 'https://convertkit.com/' },
                { name: 'Mailerlite', description: 'Email marketing abordable', type: 'freemium', link: 'https://www.mailerlite.com/' }
            ],
            'Analytics et Tracking': [
                { name: 'Google Analytics 4', description: 'Analytics web gratuit', type: 'gratuit', link: 'https://analytics.google.com/' },
                { name: 'Hotjar', description: 'Heatmaps et enregistrements', type: 'freemium', link: 'https://www.hotjar.com/' },
                { name: 'Google Tag Manager', description: 'Gestion des tags', type: 'gratuit', link: 'https://tagmanager.google.com/' }
            ]
        },
        'finance': {
            'Éducation Financière': [
                { name: 'Investopedia', description: 'Encyclopédie financière complète', type: 'gratuit', link: 'https://www.investopedia.com/' },
                { name: 'Khan Academy Finance', description: 'Cours finance gratuits', type: 'gratuit', link: 'https://www.khanacademy.org/economics-finance-domain' },
                { name: 'Heu?reka (YouTube)', description: 'Finance personnelle en français', type: 'gratuit', link: 'https://www.youtube.com/c/Heureka' },
                { name: 'Finary', description: 'Suivi patrimoine gratuit', type: 'freemium', link: 'https://finary.com/' }
            ],
            'Investissement': [
                { name: 'Boursorama', description: 'Compte-titres et PEA gratuit', type: 'gratuit', link: 'https://www.boursorama.com/' },
                { name: 'Trade Republic', description: 'Investissement 1€/ordre', type: 'freemium', link: 'https://traderepublic.com/' },
                { name: 'Degiro', description: 'Courtier low-cost européen', type: 'freemium', link: 'https://www.degiro.fr/' },
                { name: 'ETF World (JustETF)', description: 'Recherche ETF', type: 'gratuit', link: 'https://www.justetf.com/fr/' }
            ],
            'Trading': [
                { name: 'TradingView', description: 'Charts et analyse technique', type: 'freemium', link: 'https://www.tradingview.com/' },
                { name: 'Investir.fr', description: 'Actualités boursières FR', type: 'freemium', link: 'https://investir.lesechos.fr/' },
                { name: 'Zone Bourse', description: 'Analyses et screeners', type: 'freemium', link: 'https://www.zonebourse.com/' },
                { name: 'Yahoo Finance', description: 'Données financières gratuites', type: 'gratuit', link: 'https://finance.yahoo.com/' }
            ],
            'Crypto': [
                { name: 'CoinMarketCap', description: 'Prix et données crypto', type: 'gratuit', link: 'https://coinmarketcap.com/' },
                { name: 'Binance Academy', description: 'Formation crypto gratuite', type: 'gratuit', link: 'https://academy.binance.com/' },
                { name: 'DeFi Llama', description: 'Analytics DeFi', type: 'gratuit', link: 'https://defillama.com/' },
                { name: 'Kraken', description: 'Exchange crypto fiable', type: 'gratuit', link: 'https://www.kraken.com/' }
            ]
        },
        'writing': {
            'Outils d\'Écriture': [
                { name: 'Google Docs', description: 'Traitement de texte gratuit', type: 'gratuit', link: 'https://docs.google.com/' },
                { name: 'Notion', description: 'Notes et organisation', type: 'gratuit', link: 'https://www.notion.so/' },
                { name: 'Hemingway Editor', description: 'Améliorer la lisibilité', type: 'gratuit', link: 'https://hemingwayapp.com/' },
                { name: 'Grammarly', description: 'Correction anglaise', type: 'freemium', link: 'https://www.grammarly.com/' },
                { name: 'LanguageTool', description: 'Correction française gratuite', type: 'freemium', link: 'https://languagetool.org/' },
                { name: 'Scrivener', description: 'Logiciel pro pour écrivains', type: 'payant', link: 'https://www.literatureandlatte.com/scrivener/' }
            ],
            'Publication et Vente': [
                { name: 'Amazon KDP', description: 'Auto-publication Kindle gratuite', type: 'gratuit', link: 'https://kdp.amazon.com/' },
                { name: 'Gumroad', description: 'Vendre e-books et produits', type: 'freemium', link: 'https://gumroad.com/' },
                { name: 'Leanpub', description: 'Publication e-books techniques', type: 'freemium', link: 'https://leanpub.com/' },
                { name: 'Payhip', description: 'Alternative Gumroad', type: 'freemium', link: 'https://payhip.com/' }
            ],
            'Plateformes de Contenu': [
                { name: 'Medium', description: 'Plateforme d\'articles avec revenus', type: 'gratuit', link: 'https://medium.com/' },
                { name: 'Substack', description: 'Newsletter payante', type: 'gratuit', link: 'https://substack.com/' },
                { name: 'Hashnode', description: 'Blog développeur avec domaine custom', type: 'gratuit', link: 'https://hashnode.com/' },
                { name: 'Ghost', description: 'Plateforme de publication moderne', type: 'freemium', link: 'https://ghost.org/' }
            ],
            'Formation Écriture': [
                { name: 'Ship 30 for 30', description: 'Écrire en public', type: 'payant', link: 'https://www.ship30for30.com/' },
                { name: 'Copywriting Course', description: 'Apprendre le copywriting', type: 'freemium', link: 'https://copywritingcourse.com/' },
                { name: 'Write of Passage', description: 'Écriture online par David Perell', type: 'payant', link: 'https://writeofpassage.school/' }
            ]
        },
        'teaching': {
            'Plateformes de Cours': [
                { name: 'Udemy', description: 'Plateforme de cours en ligne leader', type: 'gratuit', link: 'https://www.udemy.com/' },
                { name: 'Skillshare', description: 'Cours créatifs et business', type: 'freemium', link: 'https://www.skillshare.com/' },
                { name: 'Teachable', description: 'Créer sa propre école en ligne', type: 'freemium', link: 'https://teachable.com/' },
                { name: 'Thinkific', description: 'Alternative Teachable', type: 'freemium', link: 'https://www.thinkific.com/' },
                { name: 'Podia', description: 'Cours, coaching et communauté', type: 'freemium', link: 'https://www.podia.com/' },
                { name: 'Gumroad', description: 'Vendre cours et produits', type: 'freemium', link: 'https://gumroad.com/' }
            ],
            'Outils de Création': [
                { name: 'Loom', description: 'Enregistrement écran facile', type: 'freemium', link: 'https://www.loom.com/' },
                { name: 'OBS Studio', description: 'Enregistrement pro gratuit', type: 'gratuit', link: 'https://obsproject.com/' },
                { name: 'Canva', description: 'Créer slides et visuels', type: 'freemium', link: 'https://www.canva.com/' },
                { name: 'Camtasia', description: 'Montage vidéo cours', type: 'payant', link: 'https://www.techsmith.com/video-editor.html' }
            ],
            'Coaching et Communauté': [
                { name: 'Calendly', description: 'Planifier sessions coaching', type: 'freemium', link: 'https://calendly.com/' },
                { name: 'Zoom', description: 'Visioconférence', type: 'freemium', link: 'https://zoom.us/' },
                { name: 'Discord', description: 'Communauté et cours live', type: 'gratuit', link: 'https://discord.com/' },
                { name: 'Circle', description: 'Communauté payante pro', type: 'payant', link: 'https://circle.so/' }
            ],
            'Marketing Cours': [
                { name: 'ConvertKit', description: 'Email pour créateurs de cours', type: 'freemium', link: 'https://convertkit.com/' },
                { name: 'Deadline Funnel', description: 'Scarcity marketing', type: 'payant', link: 'https://deadlinefunnel.com/' },
                { name: 'YouTube', description: 'Contenu gratuit pour attirer', type: 'gratuit', link: 'https://www.youtube.com/' }
            ]
        }
    };
    
    return resourcesByPlan[plan.planType] || resourcesByPlan['programming'];
}

function generateOpportunities(plan) {
    const opportunitiesContent = document.getElementById('opportunitiesContent');
    const opportunities = getOpportunities(plan);
    
    let html = '<div class="row g-3">';
    
    opportunities.forEach(opp => {
        html += `
            <div class="col-md-6">
                <div class="card opportunity-card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${opp.title}</h6>
                            <span class="badge bg-${opp.badge}">${opp.type}</span>
                        </div>
                        <p class="card-text small text-muted mb-3">${opp.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted"><i class="bi bi-calendar3"></i> ${opp.deadline}</small>
                            <a href="${opp.link}" target="_blank" class="btn btn-sm btn-outline-primary">
                                En savoir plus <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    opportunitiesContent.innerHTML = html;
}

function getOpportunities(plan) {
    // Common opportunities available to all
    const commonOpportunities = [
        {
            title: 'GitHub Student Developer Pack',
            description: 'Accès gratuit à des dizaines d\'outils pour développeurs (valeur 200K$)',
            type: 'Ressources',
            badge: 'info',
            deadline: 'Permanent',
            link: 'https://education.github.com/pack'
        },
        {
            title: 'Bourse CROUS sur Critères Sociaux',
            description: 'Jusqu\'à 5 965€/an selon échelon',
            type: 'Bourse',
            badge: 'success',
            deadline: 'Mai',
            link: 'https://www.messervices.etudiant.gouv.fr'
        }
    ];
    
    // Plan-specific opportunities
    const planOpportunities = {
        'programming': [
            {
                title: 'Google Summer of Code',
                description: 'Programme payé pour contribuer à l\'open source (3000-6000$)',
                type: 'Programme',
                badge: 'success',
                deadline: 'Mars-Avril',
                link: 'https://summerofcode.withgoogle.com/'
            },
            {
                title: 'MLH Hackathons',
                description: 'Hackathons étudiants organisés toute l\'année',
                type: 'Événement',
                badge: 'primary',
                deadline: 'Toute l\'année',
                link: 'https://mlh.io/'
            },
            {
                title: 'Google Hash Code',
                description: 'Competition algorithmique Google avec prix',
                type: 'Compétition',
                badge: 'warning',
                deadline: 'Février',
                link: 'https://codingcompetitions.withgoogle.com/'
            }
        ],
        'datascience': [
            {
                title: 'Kaggle Competitions',
                description: 'Compétitions ML avec prix jusqu\'à 100 000$',
                type: 'Compétition',
                badge: 'warning',
                deadline: 'Toute l\'année',
                link: 'https://www.kaggle.com/competitions'
            },
            {
                title: 'AWS Machine Learning Scholarship',
                description: 'Formation ML gratuite sponsorisée par AWS',
                type: 'Bourse',
                badge: 'success',
                deadline: 'Variable',
                link: 'https://www.udacity.com/scholarships/aws-machine-learning-scholarship-program'
            },
            {
                title: 'Google AI Residency',
                description: 'Programme de recherche IA chez Google',
                type: 'Programme',
                badge: 'primary',
                deadline: 'Automne',
                link: 'https://research.google/careers/ai-residency/'
            }
        ],
        'cybersecurity': [
            {
                title: 'HackerOne Bug Bounty',
                description: 'Gagner de l\'argent en trouvant des failles',
                type: 'Bug Bounty',
                badge: 'danger',
                deadline: 'Permanent',
                link: 'https://www.hackerone.com/'
            },
            {
                title: 'CyberTalent France',
                description: 'Challenge national de cybersécurité',
                type: 'Compétition',
                badge: 'warning',
                deadline: 'Annuel',
                link: 'https://www.cybertalents.com/'
            },
            {
                title: 'Root-Me Pro Certification',
                description: 'Certification française reconnue',
                type: 'Certification',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://www.root-me.org/'
            }
        ],
        'business': [
            {
                title: 'Prix PEPITE - Tremplin',
                description: 'Jusqu\'à 10 000€ pour étudiants-entrepreneurs',
                type: 'Concours',
                badge: 'warning',
                deadline: 'Juin',
                link: 'https://www.pepite-france.fr/prix-pepite'
            },
            {
                title: 'Concours I-Lab',
                description: 'Jusqu\'à 600 000€ pour création entreprise innovante',
                type: 'Financement',
                badge: 'success',
                deadline: 'Septembre',
                link: 'https://www.enseignementsup-recherche.gouv.fr/fr/concours-i-lab-48146'
            },
            {
                title: 'Station F Fighters Program',
                description: 'Programme d\'incubation gratuit',
                type: 'Incubateur',
                badge: 'primary',
                deadline: 'Rolling',
                link: 'https://stationf.co/programs/fighters'
            }
        ],
        'ecommerce': [
            {
                title: 'Shopify Partner Program',
                description: 'Créer une boutique test gratuite + commissions',
                type: 'Programme',
                badge: 'success',
                deadline: 'Permanent',
                link: 'https://www.shopify.com/partners'
            },
            {
                title: 'Amazon Seller Academy',
                description: 'Formation vendeur Amazon gratuite',
                type: 'Formation',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://sellercentral.amazon.fr/learn'
            },
            {
                title: 'La French Tech E-commerce',
                description: 'Réseau et financement e-commerce',
                type: 'Réseau',
                badge: 'primary',
                deadline: 'Permanent',
                link: 'https://lafrenchtech.com/'
            }
        ],
        'freelancing': [
            {
                title: 'Malt Academy',
                description: 'Formation gratuite pour freelances',
                type: 'Formation',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://www.malt.fr/resources'
            },
            {
                title: 'ACRE - Aide Création',
                description: 'Exonération cotisations 1ère année',
                type: 'Aide',
                badge: 'success',
                deadline: 'À la création',
                link: 'https://www.autoentrepreneur.urssaf.fr/'
            },
            {
                title: 'Upwork Rising Talent',
                description: 'Badge pour nouveaux freelances prometteurs',
                type: 'Distinction',
                badge: 'warning',
                deadline: 'Permanent',
                link: 'https://www.upwork.com/'
            }
        ],
        'content': [
            {
                title: 'YouTube Partner Program',
                description: 'Monétisation à 1000 abonnés + 4000h vues',
                type: 'Monétisation',
                badge: 'danger',
                deadline: 'Critères atteints',
                link: 'https://www.youtube.com/creators/'
            },
            {
                title: 'TikTok Creator Fund',
                description: 'Revenus basés sur les vues',
                type: 'Monétisation',
                badge: 'warning',
                deadline: '10K followers',
                link: 'https://www.tiktok.com/creators/creator-portal/'
            },
            {
                title: 'Medium Partner Program',
                description: 'Gagner de l\'argent avec des articles',
                type: 'Monétisation',
                badge: 'success',
                deadline: 'Permanent',
                link: 'https://medium.com/creators'
            }
        ],
        'design': [
            {
                title: 'Adobe Creative Residency',
                description: 'Programme sponsorisé pour créatifs',
                type: 'Résidence',
                badge: 'danger',
                deadline: 'Annuel',
                link: 'https://www.adobe.com/about-adobe/creative-residency.html'
            },
            {
                title: 'Awwwards Young Jury',
                description: 'Rejoindre le jury jeunes designers',
                type: 'Programme',
                badge: 'warning',
                deadline: 'Annuel',
                link: 'https://www.awwwards.com/'
            },
            {
                title: '99designs Contests',
                description: 'Gagner de l\'argent en design',
                type: 'Concours',
                badge: 'success',
                deadline: 'Permanent',
                link: 'https://99designs.fr/'
            }
        ],
        'marketing': [
            {
                title: 'Google Partners Certification',
                description: 'Certification Google Ads gratuite',
                type: 'Certification',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://www.google.com/partners/'
            },
            {
                title: 'HubSpot Solutions Partner',
                description: 'Devenir partenaire certifié',
                type: 'Partenariat',
                badge: 'warning',
                deadline: 'Permanent',
                link: 'https://www.hubspot.com/partners'
            },
            {
                title: 'SEMrush Affiliate Program',
                description: '40% commission récurrente',
                type: 'Affiliation',
                badge: 'success',
                deadline: 'Permanent',
                link: 'https://www.semrush.com/kb/684-berush-affiliate-program'
            }
        ],
        'finance': [
            {
                title: 'CFA Scholarship',
                description: 'Bourse pour certification CFA',
                type: 'Bourse',
                badge: 'success',
                deadline: 'Variable',
                link: 'https://www.cfainstitute.org/en/programs/cfa/scholarships'
            },
            {
                title: 'Concours Trading AMF',
                description: 'Compétition de trading simulé',
                type: 'Compétition',
                badge: 'warning',
                deadline: 'Annuel',
                link: 'https://www.amf-france.org/'
            },
            {
                title: 'Quantitative Finance Internships',
                description: 'Stages en finance quantitative',
                type: 'Stage',
                badge: 'primary',
                deadline: 'Automne',
                link: 'https://www.quantstart.com/'
            }
        ],
        'writing': [
            {
                title: 'Amazon KDP Select',
                description: 'Programme de promotion gratuite Kindle',
                type: 'Programme',
                badge: 'warning',
                deadline: 'Permanent',
                link: 'https://kdp.amazon.com/'
            },
            {
                title: 'Medium Boost',
                description: 'Boost de visibilité pour articles',
                type: 'Promotion',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://blog.medium.com/new-ways-to-boost-your-stories-af6d6e754510'
            },
            {
                title: 'Prix du Jeune Écrivain',
                description: 'Concours littéraire francophone',
                type: 'Concours',
                badge: 'success',
                deadline: 'Février',
                link: 'https://www.pfrjs.org/'
            }
        ],
        'teaching': [
            {
                title: 'Udemy New Instructor',
                description: 'Programme de bienvenue instructeurs',
                type: 'Programme',
                badge: 'info',
                deadline: 'Permanent',
                link: 'https://www.udemy.com/teaching/'
            },
            {
                title: 'Skillshare Teacher Program',
                description: 'Revenus passifs avec cours créatifs',
                type: 'Programme',
                badge: 'success',
                deadline: 'Permanent',
                link: 'https://www.skillshare.com/teach'
            },
            {
                title: 'YouTube Creator Academy',
                description: 'Formation gratuite pour créateurs',
                type: 'Formation',
                badge: 'warning',
                deadline: 'Permanent',
                link: 'https://creatoracademy.youtube.com/'
            }
        ]
    };
    
    // Combine common and plan-specific opportunities
    const specificOpps = planOpportunities[plan.planType] || planOpportunities['programming'];
    return [...specificOpps, ...commonOpportunities];
}

function downloadPlan() {
    const userPlan = JSON.parse(localStorage.getItem('userPlan'));
    
    if (!userPlan) {
        showNotification('Erreur: Plan non trouvé', 'error');
        return;
    }
    
    try {
        showNotification('Génération du PDF en cours...', 'info');
        
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font
        doc.setFont('helvetica');
        
        // Title
        doc.setFontSize(24);
        doc.setTextColor(102, 126, 234);
        doc.text('Mon Plan Personnalisé', 105, 20, { align: 'center' });
        
        // User info
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`Bonjour ${userPlan.name} !`, 20, 40);
        
        // Plan details
        doc.setFontSize(12);
        let yPos = 55;
        
        doc.text(`Type de plan: ${PLAN_TYPE_LABELS[userPlan.planType]}`, 20, yPos);
        yPos += 8;
        doc.text(`Domaine: ${userPlan.field}`, 20, yPos);
        yPos += 8;
        doc.text(`Durée: ${TIMELINE_LABELS[userPlan.timeline]}`, 20, yPos);
        yPos += 8;
        doc.text(`Temps par semaine: ${userPlan.timePerWeek}`, 20, yPos);
        yPos += 8;
        doc.text(`Budget mensuel: ${userPlan.budget === '0' ? 'Gratuit' : userPlan.budget + '€'}`, 20, yPos);
        yPos += 15;
        
        // Roadmap phases
        doc.setFontSize(16);
        doc.setTextColor(102, 126, 234);
        doc.text('Roadmap', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        const phases = getRoadmapPhases(userPlan);
        
        phases.forEach((phase, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(13);
            doc.setTextColor(102, 126, 234);
            doc.text(`Phase ${index + 1}: ${phase.title}`, 20, yPos);
            yPos += 7;
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(phase.duration, 20, yPos);
            yPos += 7;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            phase.tasks.forEach(task => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`• ${task}`, 25, yPos);
                yPos += 6;
            });
            yPos += 5;
        });
        
        // Milestones
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }
        
        yPos += 10;
        doc.setFontSize(16);
        doc.setTextColor(102, 126, 234);
        doc.text('Étapes Clés', 20, yPos);
        yPos += 10;
        
        const milestones = getMilestones(userPlan);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        milestones.forEach((milestone, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${milestone.title} - ${milestone.timeline}`, 20, yPos);
            yPos += 7;
        });
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} de ${pageCount}`, 105, 285, { align: 'center' });
            doc.text('Généré par PlanGenerator', 105, 290, { align: 'center' });
        }
        
        // Download the PDF
        doc.save(`Mon_Plan_${userPlan.name.replace(/\s+/g, '_')}.pdf`);
        
        showNotification('PDF téléchargé avec succès ! 📄', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Erreur lors de la génération du PDF. Veuillez réessayer.', 'error');
    }
}

function sharePlan() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: 'Mon Plan Personnalisé - PlanGenerator',
            text: 'Découvre mon plan personnalisé créé avec PlanGenerator !',
            url: url
        }).catch((error) => {
            // User cancelled or error occurred
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        });
    } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Lien copié dans le presse-papier !', 'success');
            }).catch((error) => {
                console.error('Failed to copy to clipboard:', error);
                showNotification('Impossible de copier le lien. Veuillez le copier manuellement depuis la barre d\'adresse.', 'error');
            });
        } else {
            // Clipboard API not available
            showNotification('Lien: ' + url + '\nCopiez-le manuellement depuis la barre d\'adresse.', 'info');
        }
    }
}

// Logout function
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }
}


// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Helper function to show notifications using Bootstrap toast or simple div
function showNotification(message, type = 'info') {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 500px;';
    
    // Safely set text content to prevent XSS
    const messageText = document.createTextNode(message);
    notification.appendChild(messageText);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    notification.appendChild(closeButton);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
    }, 5000);
}

// Generate Gantt Chart
function generateGanttChart(plan) {
    const ganttChart = document.getElementById('ganttChart');
    const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    
    if (tasks.length === 0) {
        ganttChart.innerHTML = '<p class="text-center text-muted py-5">Aucune tâche disponible. Les tâches seront générées automatiquement.</p>';
        return;
    }
    
    // Filter and sort tasks by due date
    const tasksWithDates = tasks.filter(t => t.dueDate).sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
    );
    
    if (tasksWithDates.length === 0) {
        ganttChart.innerHTML = '<p class="text-center text-muted py-5">Aucune tâche avec date d\'échéance.</p>';
        return;
    }
    
    // Calculate date range
    const startDate = new Date(tasksWithDates[0].dueDate);
    const endDate = new Date(tasksWithDates[tasksWithDates.length - 1].dueDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Build timeline header
    const monthsSet = new Set();
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        monthsSet.add(currentDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    let html = '<div class="gantt-wrapper" style="overflow-x: auto;">';
    
    // Timeline header
    html += '<div class="gantt-timeline mb-3" style="min-width: 800px;">';
    html += '<div class="d-flex justify-content-between border-bottom pb-2 mb-2">';
    monthsSet.forEach(month => {
        html += `<div class="text-center fw-bold text-primary">${month}</div>`;
    });
    html += '</div></div>';
    
    // Task bars
    html += '<div class="gantt-tasks" style="min-width: 800px;">';
    
    const priorityColors = {
        'high': '#dc3545',
        'medium': '#ffc107',
        'low': '#198754'
    };
    
    tasksWithDates.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const daysFromStart = Math.ceil((taskDate - startDate) / (1000 * 60 * 60 * 24));
        const leftPercent = (daysFromStart / totalDays) * 100;
        
        // Bar width represents 1 week or less
        const barWidth = Math.min(10, (7 / totalDays) * 100);
        
        const color = priorityColors[task.priority] || '#6c757d';
        const opacity = task.completed ? '0.5' : '1';
        
        html += `
            <div class="gantt-bar mb-2" style="
                margin-left: ${leftPercent}%;
                width: ${barWidth}%;
                background-color: ${color};
                opacity: ${opacity};
                height: 40px;
                border-radius: 5px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                color: white;
                font-size: 0.85rem;
                position: relative;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            " title="${task.title} - ${formatDate(task.dueDate)}">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
                    ${task.completed ? ' ✓' : ''}
                </span>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Legend
    html += '<div class="gantt-legend mt-4">';
    html += '<h6 class="mb-3">Légende:</h6>';
    html += '<div class="d-flex gap-4 flex-wrap">';
    html += '<div><span style="display: inline-block; width: 20px; height: 20px; background: #dc3545; border-radius: 3px;"></span> Priorité Haute</div>';
    html += '<div><span style="display: inline-block; width: 20px; height: 20px; background: #ffc107; border-radius: 3px;"></span> Priorité Moyenne</div>';
    html += '<div><span style="display: inline-block; width: 20px; height: 20px; background: #198754; border-radius: 3px;"></span> Priorité Basse</div>';
    html += '<div><span style="display: inline-block; width: 20px; height: 20px; background: #6c757d; opacity: 0.5; border-radius: 3px;"></span> Complétée</div>';
    html += '</div></div>';
    
    html += '</div>';
    
    ganttChart.innerHTML = html;
}

// Auto-generate tasks based on user plan
function generateAutoTasks(plan) {
    // Check if tasks have already been generated
    const tasksGenerated = localStorage.getItem('tasksAutoGenerated');
    if (tasksGenerated === 'true') {
        return; // Tasks already generated
    }
    
    const existingTasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    const phases = getRoadmapPhases(plan);
    const newTasks = [];
    
    // Calculate start date
    const startDate = new Date();
    
    // Timeline in days based on plan
    const timelineDays = {
        '3months': 90,
        '6months': 180,
        '1year': 365,
        '2years': 730
    };
    
    const totalDays = timelineDays[plan.timeline] || 180;
    const daysPerPhase = Math.floor(totalDays / phases.length);
    
    phases.forEach((phase, phaseIndex) => {
        const phaseStartDay = phaseIndex * daysPerPhase;
        const taskDaysInterval = Math.floor(daysPerPhase / phase.tasks.length);
        
        phase.tasks.forEach((taskTitle, taskIndex) => {
            const taskDueDay = phaseStartDay + (taskIndex + 1) * taskDaysInterval;
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + taskDueDay);
            
            // Priority based on phase
            let priority = 'medium';
            if (phaseIndex === 0) priority = 'high'; // First phase is high priority
            else if (phaseIndex === phases.length - 1) priority = 'low'; // Last phase can be lower
            
            const task = {
                id: Date.now() + taskIndex + phaseIndex * 1000,
                title: `${phase.title}: ${taskTitle}`,
                description: `Phase ${phaseIndex + 1} - ${phase.duration}`,
                dueDate: dueDate.toISOString().split('T')[0],
                priority: priority,
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null,
                autoGenerated: true
            };
            
            newTasks.push(task);
        });
    });
    
    // Merge with existing tasks and save
    const allTasks = [...newTasks, ...existingTasks];
    localStorage.setItem('userTasks', JSON.stringify(allTasks));
    localStorage.setItem('tasksAutoGenerated', 'true');
    
    showNotification(`${newTasks.length} tâches ont été créées automatiquement pour ton plan !`, 'success');
}

// Send plan details via email
function sendPDFByEmail() {
    const userPlan = JSON.parse(localStorage.getItem('userPlan'));
    
    if (!userPlan) {
        showNotification('Erreur: Plan non trouvé', 'error');
        return;
    }
    
    try {
        // Create email content
        const subject = encodeURIComponent(`Mon Plan Personnalisé - ${PLAN_TYPE_LABELS[userPlan.planType]}`);
        
        let body = `Bonjour ${userPlan.name},\n\n`;
        body += `Voici les détails de ton plan personnalisé:\n\n`;
        body += `Type: ${PLAN_TYPE_LABELS[userPlan.planType]}\n`;
        body += `Domaine: ${userPlan.field}\n`;
        body += `Durée: ${TIMELINE_LABELS[userPlan.timeline]}\n`;
        body += `Temps par semaine: ${userPlan.timePerWeek}\n`;
        body += `Budget: ${userPlan.budget === '0' ? 'Gratuit' : userPlan.budget + '€'}\n\n`;
        body += `Pour voir ton plan complet avec le diagramme de Gantt et toutes les étapes détaillées, visite:\n`;
        body += window.location.href;
        body += `\n\nTu peux également télécharger le PDF de ton plan directement depuis le tableau de bord.\n\n`;
        body += `Bonne chance dans ton parcours!\n\n`;
        body += `---\n`;
        body += `Généré par PlanGenerator`;
        
        const encodedBody = encodeURIComponent(body);
        
        // Open email client with pre-filled content
        const mailtoLink = `mailto:${userPlan.email}?subject=${subject}&body=${encodedBody}`;
        window.location.href = mailtoLink;
        
        showNotification('Ouvre ton client email pour envoyer le plan ! 📧', 'info');
        
    } catch (error) {
        console.error('Error creating email:', error);
        showNotification('Erreur lors de la création de l\'email. Veuillez télécharger le PDF à la place.', 'error');
    }
}

// Generate progress charts
function generateProgressCharts(plan) {
    const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    
    // 1. Tasks Completion Pie Chart
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    
    const tasksCompletionCtx = document.getElementById('tasksCompletionChart');
    if (tasksCompletionCtx) {
        new Chart(tasksCompletionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Complétées', 'En cours'],
                datasets: [{
                    data: [completedTasks, pendingTasks],
                    backgroundColor: ['#198754', '#ffc107'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: `${completedTasks} / ${tasks.length} tâches`
                    }
                }
            }
        });
    }
    
    // 2. Time Invested Bar Chart (simulated data based on plan)
    const timeInvestedCtx = document.getElementById('timeInvestedChart');
    if (timeInvestedCtx) {
        // Extract hours from plan.timePerWeek (e.g., "10-15h" -> 12.5)
        const timeMatch = plan.timePerWeek.match(/(\d+)-?(\d+)?/);
        const avgHoursPerWeek = timeMatch ? 
            (parseInt(timeMatch[1]) + (timeMatch[2] ? parseInt(timeMatch[2]) : parseInt(timeMatch[1]))) / 2 : 10;
        
        // Calculate weeks since plan creation (simulate)
        const weeksData = [
            { week: 'S1', hours: avgHoursPerWeek * 0.6 },
            { week: 'S2', hours: avgHoursPerWeek * 0.8 },
            { week: 'S3', hours: avgHoursPerWeek * 0.9 },
            { week: 'S4', hours: avgHoursPerWeek * 1.0 }
        ];
        
        new Chart(timeInvestedCtx, {
            type: 'bar',
            data: {
                labels: weeksData.map(w => w.week),
                datasets: [{
                    label: 'Heures investies',
                    data: weeksData.map(w => w.hours),
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Heures'
                        }
                    }
                }
            }
        });
    }
    
    // 3. Progress Curve Chart (Line Chart showing cumulative progress)
    const progressCurveCtx = document.getElementById('progressCurveChart');
    if (progressCurveCtx) {
        // Generate progress data over time
        const totalTasks = tasks.length;
        const timelineMonths = {
            '3months': 3,
            '6months': 6,
            '1year': 12,
            '2years': 24
        };
        const months = timelineMonths[plan.timeline] || 6;
        
        // Generate progress curve (S-curve simulation)
        const progressData = [];
        const labels = [];
        for (let i = 0; i <= months; i++) {
            labels.push(`Mois ${i}`);
            // S-curve: slow start, fast middle, slow end
            const progress = (1 / (1 + Math.exp(-0.5 * (i - months/2)))) * 100;
            progressData.push(Math.min(progress, 100));
        }
        
        // Overlay actual completion
        const actualProgress = (completedTasks / totalTasks) * 100;
        const currentMonth = 2; // Simulate we're at month 2
        
        new Chart(progressCurveCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Progression Prévue',
                        data: progressData,
                        borderColor: '#6c757d',
                        backgroundColor: 'rgba(108, 117, 125, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'Progression Réelle',
                        data: labels.map((_, i) => i <= currentMonth ? (i / currentMonth) * actualProgress : null),
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.2)',
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#198754'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Progression (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Timeline'
                        }
                    }
                }
            }
        });
    }
    
    // 4. Weekly Stats Chart (Productivity over weeks)
    const weeklyStatsCtx = document.getElementById('weeklyStatsChart');
    if (weeklyStatsCtx) {
        // Generate weekly productivity data
        const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];
        const productivityData = [65, 72, 80, 75, 85, 90]; // Simulated productivity scores
        
        new Chart(weeklyStatsCtx, {
            type: 'line',
            data: {
                labels: weeks,
                datasets: [{
                    label: 'Productivité (%)',
                    data: productivityData,
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#ffc107',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

