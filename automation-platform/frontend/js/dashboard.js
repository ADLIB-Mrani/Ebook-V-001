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
});

function populateUserInfo(plan) {
    document.getElementById('userName').textContent = plan.name;
    
    const planTypeLabels = {
        'programming': 'Programmation',
        'business': 'Business',
        'freelancing': 'Freelancing',
        'content': 'Création de contenu'
    };
    
    const summary = `Plan ${planTypeLabels[plan.planType]} - ${plan.field}`;
    document.getElementById('planSummary').textContent = summary;
}

function populateStats(plan) {
    // Duration
    const timelineLabels = {
        '3months': '3 mois',
        '6months': '6 mois',
        '1year': '1 an',
        '2years': '2 ans'
    };
    document.getElementById('planDuration').textContent = timelineLabels[plan.timeline];
    
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
            {
                title: 'Premier projet GitHub',
                description: 'Publier ton premier projet complet sur GitHub',
                timeline: 'Mois 2'
            },
            {
                title: 'Portfolio en ligne',
                description: 'Créer et déployer ton portfolio professionnel',
                timeline: 'Mois 3-4'
            },
            {
                title: 'Premier stage/job',
                description: 'Décrocher ton premier stage ou mission',
                timeline: 'Mois 5-6'
            }
        ],
        'business': [
            {
                title: 'MVP lancé',
                description: 'Lancer ton MVP et obtenir les premiers retours',
                timeline: 'Mois 2-3'
            },
            {
                title: 'Premiers clients',
                description: 'Acquérir tes 10 premiers clients',
                timeline: 'Mois 4'
            },
            {
                title: 'Rentabilité',
                description: 'Atteindre le seuil de rentabilité',
                timeline: 'Mois 6'
            }
        ],
        'freelancing': [
            {
                title: 'Micro-entreprise créée',
                description: 'Finaliser ta micro-entreprise et setup administratif',
                timeline: 'Mois 2'
            },
            {
                title: 'Premier client',
                description: 'Décrocher ta première mission freelance',
                timeline: 'Mois 3-4'
            },
            {
                title: '5 missions complétées',
                description: 'Compléter 5 missions et avoir des témoignages',
                timeline: 'Mois 6'
            }
        ],
        'content': [
            {
                title: '10 contenus publiés',
                description: 'Publier régulièrement et trouver ton rythme',
                timeline: 'Mois 2'
            },
            {
                title: '1000 abonnés',
                description: 'Atteindre ton premier millier d\'abonnés',
                timeline: 'Mois 4-5'
            },
            {
                title: 'Première monétisation',
                description: 'Gagner tes premiers revenus du contenu',
                timeline: 'Mois 6'
            }
        ]
    };
    
    return [...baseMilestones, ...planSpecificMilestones[plan.planType] || []];
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
            'Apprentissage': [
                {
                    name: 'freeCodeCamp',
                    description: 'Cours complets de programmation, entièrement gratuit',
                    type: 'gratuit',
                    link: 'https://www.freecodecamp.org/'
                },
                {
                    name: 'The Odin Project',
                    description: 'Curriculum complet pour devenir développeur web',
                    type: 'gratuit',
                    link: 'https://www.theodinproject.com/'
                },
                {
                    name: 'MDN Web Docs',
                    description: 'Documentation complète pour le développement web',
                    type: 'gratuit',
                    link: 'https://developer.mozilla.org/'
                }
            ],
            'Outils': [
                {
                    name: 'VS Code',
                    description: 'Éditeur de code gratuit et puissant',
                    type: 'gratuit',
                    link: 'https://code.visualstudio.com/'
                },
                {
                    name: 'GitHub',
                    description: 'Hébergement de code et portfolio',
                    type: 'gratuit',
                    link: 'https://github.com/'
                },
                {
                    name: 'Stack Overflow',
                    description: 'Communauté Q&A pour développeurs',
                    type: 'gratuit',
                    link: 'https://stackoverflow.com/'
                }
            ]
        },
        'business': {
            'Création': [
                {
                    name: 'PEPITE',
                    description: 'Statut étudiant entrepreneur en France',
                    type: 'gratuit',
                    link: 'https://www.pepite-france.fr/'
                },
                {
                    name: 'BPI France Création',
                    description: 'Ressources pour créer son entreprise',
                    type: 'gratuit',
                    link: 'https://bpifrance-creation.fr/'
                },
                {
                    name: 'Autoentrepreneur.urssaf.fr',
                    description: 'Créer sa micro-entreprise',
                    type: 'gratuit',
                    link: 'https://www.autoentrepreneur.urssaf.fr/'
                }
            ],
            'Formation': [
                {
                    name: 'Station F',
                    description: 'Plus grand campus de startups au monde',
                    type: 'gratuit',
                    link: 'https://stationf.co/'
                },
                {
                    name: 'OpenClassrooms - Entrepreneuriat',
                    description: 'Cours gratuits sur l\'entrepreneuriat',
                    type: 'gratuit',
                    link: 'https://openclassrooms.com/'
                },
                {
                    name: 'Google Ateliers Numériques',
                    description: 'Formation marketing digital gratuite',
                    type: 'gratuit',
                    link: 'https://learndigital.withgoogle.com/'
                }
            ]
        },
        'freelancing': {
            'Plateformes': [
                {
                    name: 'Malt',
                    description: 'Plateforme de freelancing française',
                    type: 'gratuit',
                    link: 'https://www.malt.fr/'
                },
                {
                    name: 'Upwork',
                    description: 'Plateforme internationale de freelancing',
                    type: 'gratuit',
                    link: 'https://www.upwork.com/'
                },
                {
                    name: 'Fiverr',
                    description: 'Vendre des services en ligne',
                    type: 'gratuit',
                    link: 'https://www.fiverr.com/'
                }
            ],
            'Outils': [
                {
                    name: 'Notion',
                    description: 'Gestion de projets et organisation',
                    type: 'gratuit',
                    link: 'https://www.notion.so/'
                },
                {
                    name: 'Canva',
                    description: 'Création de visuels professionnels',
                    type: 'gratuit',
                    link: 'https://www.canva.com/'
                },
                {
                    name: 'Invoice Generator',
                    description: 'Générateur de factures gratuit',
                    type: 'gratuit',
                    link: 'https://invoice-generator.com/'
                }
            ]
        },
        'content': {
            'Plateformes': [
                {
                    name: 'YouTube',
                    description: 'Plateforme vidéo principale',
                    type: 'gratuit',
                    link: 'https://www.youtube.com/'
                },
                {
                    name: 'TikTok',
                    description: 'Vidéos courtes et virales',
                    type: 'gratuit',
                    link: 'https://www.tiktok.com/'
                },
                {
                    name: 'Medium',
                    description: 'Plateforme de blogging',
                    type: 'gratuit',
                    link: 'https://medium.com/'
                }
            ],
            'Outils': [
                {
                    name: 'DaVinci Resolve',
                    description: 'Montage vidéo professionnel gratuit',
                    type: 'gratuit',
                    link: 'https://www.blackmagicdesign.com/products/davinciresolve/'
                },
                {
                    name: 'Canva',
                    description: 'Miniatures et visuels',
                    type: 'gratuit',
                    link: 'https://www.canva.com/'
                },
                {
                    name: 'TubeBuddy',
                    description: 'Optimisation YouTube',
                    type: 'gratuit/payant',
                    link: 'https://www.tubebuddy.com/'
                }
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
    return [
        {
            title: 'GitHub Student Developer Pack',
            description: 'Accès gratuit à des dizaines d\'outils pour développeurs (valeur 200K$)',
            type: 'Ressources',
            badge: 'info',
            deadline: 'Permanent',
            link: 'https://education.github.com/pack'
        },
        {
            title: 'Google Summer of Code',
            description: 'Programme payé pour contribuer à l\'open source (stipendium)',
            type: 'Programme',
            badge: 'success',
            deadline: 'Mars-Avril',
            link: 'https://summerofcode.withgoogle.com/'
        },
        {
            title: 'Concours d\'Innovation i-Lab',
            description: 'Aide jusqu\'à 600K€ pour projets innovants',
            type: 'Financement',
            badge: 'warning',
            deadline: 'Variable',
            link: 'https://www.bpifrance.fr/nos-appels-a-projets-concours/appel-a-projets-i-lab'
        },
        {
            title: 'Hackathons MLH',
            description: 'Hackathons étudiants organisés toute l\'année',
            type: 'Événement',
            badge: 'primary',
            deadline: 'Toute l\'année',
            link: 'https://mlh.io/'
        }
    ];
}

function downloadPlan() {
    showNotification('Fonctionnalité en cours de développement. Tu recevras bientôt un email avec le lien de téléchargement PDF.', 'info');
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
