// Constants for plan types and timelines
const PLAN_TYPE_LABELS = {
    'programming': 'Programmation',
    'business': 'Business',
    'freelancing': 'Freelancing',
    'content': 'Création de contenu'
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

