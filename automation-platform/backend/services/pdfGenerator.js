const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF plan for the user
 * @param {Object} plan - The user's plan object
 * @param {String} outputPath - Path where to save the PDF
 * @returns {Promise} - Resolves when PDF is generated
 */
const generatePlanPDF = (plan, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a document
            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });

            // Pipe the PDF to a file
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Add header with gradient-like background
            doc.rect(0, 0, doc.page.width, 150).fill('#667eea');
            
            // Title
            doc.fillColor('#ffffff')
                .fontSize(30)
                .text('Mon Plan Personnalisé', 50, 50, {
                    align: 'center'
                });

            doc.fontSize(16)
                .text('PlanGenerator - Automation Platform', 50, 95, {
                    align: 'center'
                });

            // User info section
            doc.fillColor('#000000')
                .fontSize(14)
                .text(`Préparé pour: ${plan.name}`, 50, 180);

            doc.fontSize(11)
                .fillColor('#666666')
                .text(`Email: ${plan.email}`, 50, 205);

            const planTypeLabels = {
                'programming': 'Programmation',
                'business': 'Business',
                'freelancing': 'Freelancing',
                'content': 'Création de contenu'
            };

            const timelineLabels = {
                '3months': '3 mois',
                '6months': '6 mois',
                '1year': '1 an',
                '2years': '2 ans'
            };

            doc.text(`Type de plan: ${planTypeLabels[plan.planType] || plan.planType}`, 50, 225);
            doc.text(`Durée: ${timelineLabels[plan.timeline] || plan.timeline}`, 50, 245);
            doc.text(`Domaine: ${plan.field}`, 50, 265);

            // Add separator line
            doc.moveTo(50, 295)
                .lineTo(doc.page.width - 50, 295)
                .strokeColor('#667eea')
                .lineWidth(2)
                .stroke();

            let yPosition = 320;

            // Objective section
            doc.fillColor('#667eea')
                .fontSize(18)
                .text('🎯 Objectif Principal', 50, yPosition);

            yPosition += 30;
            doc.fillColor('#000000')
                .fontSize(11)
                .text(plan.goal || 'Objectif non spécifié', 50, yPosition, {
                    width: doc.page.width - 100,
                    align: 'justify'
                });

            yPosition += 60;

            // Roadmap phases
            const phases = getRoadmapPhases(plan);

            if (yPosition + 100 > doc.page.height - 50) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fillColor('#667eea')
                .fontSize(18)
                .text('🗺️ Roadmap - Phases du Parcours', 50, yPosition);

            yPosition += 30;

            phases.forEach((phase, index) => {
                // Check if we need a new page
                if (yPosition + 120 > doc.page.height - 50) {
                    doc.addPage();
                    yPosition = 50;
                }

                // Phase header
                const phaseColors = {
                    'primary': '#0d6efd',
                    'info': '#0dcaf0',
                    'success': '#198754',
                    'warning': '#ffc107'
                };

                doc.fillColor(phaseColors[phase.color] || '#0d6efd')
                    .fontSize(14)
                    .text(`Phase ${index + 1}: ${phase.title}`, 50, yPosition);

                yPosition += 20;

                doc.fillColor('#666666')
                    .fontSize(10)
                    .text(`Durée: ${phase.duration}`, 50, yPosition);

                yPosition += 20;

                // Tasks
                doc.fillColor('#000000')
                    .fontSize(10);

                phase.tasks.forEach(task => {
                    if (yPosition + 20 > doc.page.height - 50) {
                        doc.addPage();
                        yPosition = 50;
                    }
                    doc.text(`  • ${task}`, 60, yPosition);
                    yPosition += 18;
                });

                yPosition += 10;
            });

            // Resources section
            if (yPosition + 100 > doc.page.height - 50) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fillColor('#667eea')
                .fontSize(18)
                .text('📚 Ressources Recommandées', 50, yPosition);

            yPosition += 30;

            const resources = getResources(plan);

            Object.keys(resources).forEach(category => {
                if (yPosition + 80 > doc.page.height - 50) {
                    doc.addPage();
                    yPosition = 50;
                }

                doc.fillColor('#0d6efd')
                    .fontSize(12)
                    .text(category, 50, yPosition);

                yPosition += 20;

                resources[category].slice(0, 3).forEach(resource => {
                    if (yPosition + 40 > doc.page.height - 50) {
                        doc.addPage();
                        yPosition = 50;
                    }

                    doc.fillColor('#000000')
                        .fontSize(10)
                        .text(`• ${resource.name}`, 60, yPosition);

                    yPosition += 15;

                    doc.fillColor('#666666')
                        .fontSize(9)
                        .text(resource.description, 70, yPosition, {
                            width: doc.page.width - 120
                        });

                    yPosition += 20;
                });

                yPosition += 10;
            });

            // Next steps
            if (yPosition + 100 > doc.page.height - 50) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fillColor('#667eea')
                .fontSize(18)
                .text('✅ Prochaines Étapes', 50, yPosition);

            yPosition += 30;

            const nextSteps = [
                'Commence par la première phase de ta roadmap dès aujourd\'hui',
                'Consulte régulièrement ton email pour les nouvelles opportunités',
                'Sauvegarde ce document et relis-le chaque semaine',
                'Rejoins la communauté pour échanger avec d\'autres étudiants',
                'Mesure ta progression et ajuste ton plan si nécessaire'
            ];

            doc.fillColor('#000000')
                .fontSize(10);

            nextSteps.forEach((step, index) => {
                if (yPosition + 30 > doc.page.height - 50) {
                    doc.addPage();
                    yPosition = 50;
                }
                doc.text(`${index + 1}. ${step}`, 50, yPosition, {
                    width: doc.page.width - 100
                });
                yPosition += 25;
            });

            // Footer on last page
            const lastPageHeight = doc.page.height;
            doc.fillColor('#666666')
                .fontSize(9)
                .text(
                    'Généré par PlanGenerator - Automation Platform pour Étudiants',
                    50,
                    lastPageHeight - 30,
                    {
                        align: 'center',
                        width: doc.page.width - 100
                    }
                );

            // Finalize PDF
            doc.end();

            stream.on('finish', () => {
                resolve(outputPath);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Helper functions to generate content (same as frontend)
function getRoadmapPhases(plan) {
    const planTypes = {
        'programming': [
            {
                title: 'Fondamentaux',
                duration: 'Mois 1-2',
                color: 'primary',
                tasks: ['Choisir un langage', 'Syntaxe de base', 'Structures de données', 'Premiers projets']
            },
            {
                title: 'Développement',
                duration: 'Mois 3-4',
                color: 'info',
                tasks: ['Projets intermédiaires', 'Git & GitHub', 'APIs & Bases de données', 'Frameworks']
            },
            {
                title: 'Portfolio',
                duration: 'Mois 5-6',
                color: 'success',
                tasks: ['3-5 projets complets', 'Portfolio en ligne', 'GitHub actif', 'Blog technique']
            },
            {
                title: 'Opportunités',
                duration: 'Mois 7+',
                color: 'warning',
                tasks: ['Candidatures stage', 'Hackathons', 'Freelance', 'Networking']
            }
        ],
        'business': [
            {
                title: 'Idéation',
                duration: 'Mois 1',
                color: 'primary',
                tasks: ['Trouver une idée', 'Validation marché', 'Étude concurrence', 'Business model']
            },
            {
                title: 'MVP',
                duration: 'Mois 2-3',
                color: 'info',
                tasks: ['Développer MVP', 'Tests utilisateurs', 'Premiers clients', 'Feedback']
            },
            {
                title: 'Lancement',
                duration: 'Mois 4-5',
                color: 'success',
                tasks: ['Marketing', 'Réseaux sociaux', 'Croissance', 'Optimisation']
            },
            {
                title: 'Développement',
                duration: 'Mois 6+',
                color: 'warning',
                tasks: ['Levée de fonds', 'Équipe', 'Scale-up', 'Partenariats']
            }
        ],
        'freelancing': [
            {
                title: 'Compétences',
                duration: 'Mois 1-2',
                color: 'primary',
                tasks: ['Définir expertise', 'Se former', 'Projets perso', 'Portfolio']
            },
            {
                title: 'Setup',
                duration: 'Mois 3',
                color: 'info',
                tasks: ['Micro-entreprise', 'Tarifs', 'Contrats', 'Facturation']
            },
            {
                title: 'Clients',
                duration: 'Mois 4-5',
                color: 'success',
                tasks: ['Plateformes', 'Prospection', 'Premiers clients', 'Testimonials']
            },
            {
                title: 'Croissance',
                duration: 'Mois 6+',
                color: 'warning',
                tasks: ['Marketing', 'Réseau', 'Augmenter tarifs', 'Spécialisation']
            }
        ],
        'content': [
            {
                title: 'Niche',
                duration: 'Mois 1',
                color: 'primary',
                tasks: ['Trouver niche', 'Analyse audience', 'Concurrence', 'Style unique']
            },
            {
                title: 'Production',
                duration: 'Mois 2-3',
                color: 'info',
                tasks: ['Équipement', 'Premiers contenus', 'Qualité', 'Régularité']
            },
            {
                title: 'Croissance',
                duration: 'Mois 4-5',
                color: 'success',
                tasks: ['SEO/Algo', 'Engagement', '1000 abonnés', 'Collaborations']
            },
            {
                title: 'Monétisation',
                duration: 'Mois 6+',
                color: 'warning',
                tasks: ['Partenariats', 'Sponsoring', 'Produits', 'Communauté']
            }
        ]
    };
    
    return planTypes[plan.planType] || planTypes['programming'];
}

function getResources(plan) {
    const resourcesByPlan = {
        'programming': {
            'Apprentissage': [
                {
                    name: 'freeCodeCamp',
                    description: 'Cours complets de programmation, entièrement gratuit'
                },
                {
                    name: 'The Odin Project',
                    description: 'Curriculum complet pour devenir développeur web'
                },
                {
                    name: 'MDN Web Docs',
                    description: 'Documentation complète pour le développement web'
                }
            ],
            'Outils': [
                {
                    name: 'VS Code',
                    description: 'Éditeur de code gratuit et puissant'
                },
                {
                    name: 'GitHub',
                    description: 'Hébergement de code et portfolio'
                },
                {
                    name: 'Stack Overflow',
                    description: 'Communauté Q&A pour développeurs'
                }
            ]
        },
        'business': {
            'Création': [
                {
                    name: 'PEPITE',
                    description: 'Statut étudiant entrepreneur en France'
                },
                {
                    name: 'BPI France Création',
                    description: 'Ressources pour créer son entreprise'
                },
                {
                    name: 'Autoentrepreneur.urssaf.fr',
                    description: 'Créer sa micro-entreprise'
                }
            ],
            'Formation': [
                {
                    name: 'Station F',
                    description: 'Plus grand campus de startups au monde'
                },
                {
                    name: 'OpenClassrooms',
                    description: 'Cours gratuits sur l\'entrepreneuriat'
                },
                {
                    name: 'Google Ateliers Numériques',
                    description: 'Formation marketing digital gratuite'
                }
            ]
        },
        'freelancing': {
            'Plateformes': [
                {
                    name: 'Malt',
                    description: 'Plateforme de freelancing française'
                },
                {
                    name: 'Upwork',
                    description: 'Plateforme internationale de freelancing'
                },
                {
                    name: 'Fiverr',
                    description: 'Vendre des services en ligne'
                }
            ],
            'Outils': [
                {
                    name: 'Notion',
                    description: 'Gestion de projets et organisation'
                },
                {
                    name: 'Canva',
                    description: 'Création de visuels professionnels'
                },
                {
                    name: 'Invoice Generator',
                    description: 'Générateur de factures gratuit'
                }
            ]
        },
        'content': {
            'Plateformes': [
                {
                    name: 'YouTube',
                    description: 'Plateforme vidéo principale'
                },
                {
                    name: 'TikTok',
                    description: 'Vidéos courtes et virales'
                },
                {
                    name: 'Medium',
                    description: 'Plateforme de blogging'
                }
            ],
            'Outils': [
                {
                    name: 'DaVinci Resolve',
                    description: 'Montage vidéo professionnel gratuit'
                },
                {
                    name: 'Canva',
                    description: 'Miniatures et visuels'
                },
                {
                    name: 'TubeBuddy',
                    description: 'Optimisation YouTube'
                }
            ]
        }
    };
    
    return resourcesByPlan[plan.planType] || resourcesByPlan['programming'];
}

module.exports = {
    generatePlanPDF
};
