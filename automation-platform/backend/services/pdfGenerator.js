const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// PDF Layout Constants
const HEADER_HEIGHT = 180;
const TASK_INDENT = 60;
const SECTION_INDENT = 70;
const PAGE_MARGIN = 50;

// Color Palette
const COLORS = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    info: '#3b82f6',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#1f2937',
    textLight: '#6b7280',
    background: '#f9fafb'
};

/**
 * Sanitize text for PDF to prevent injection
 * @param {String} text - Text to sanitize
 * @returns {String} - Sanitized text
 */
const sanitizeText = (text) => {
    if (!text) return '';
    return String(text).substring(0, 1000); // Limit length
};

/**
 * Draw a gradient header
 */
const drawGradientHeader = (doc) => {
    // Main gradient background
    doc.rect(0, 0, doc.page.width, HEADER_HEIGHT)
       .fill('#667eea');
    
    // Add decorative elements
    doc.circle(doc.page.width - 100, 50, 60)
       .fill('#764ba2');
    
    doc.circle(80, 140, 40)
       .fill('#764ba2');
};

/**
 * Generate a PDF plan for the user
 * @param {Object} plan - The user's plan object
 * @param {String} outputPath - Path where to save the PDF (should be validated by caller)
 * @returns {Promise} - Resolves when PDF is generated
 */
const generatePlanPDF = (plan, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            // Validate input
            if (!plan || !outputPath) {
                throw new Error('Invalid parameters');
            }
            
            // Validate outputPath is a PDF file and doesn't contain path traversal
            if (!outputPath.endsWith('.pdf') || outputPath.includes('..')) {
                throw new Error('Invalid output path');
            }
            
            // Create a document
            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: PAGE_MARGIN,
                    bottom: PAGE_MARGIN,
                    left: PAGE_MARGIN,
                    right: PAGE_MARGIN
                },
                bufferPages: true,
                info: {
                    Title: 'Plan Personnalisé - PlanGenerator',
                    Author: 'PlanGenerator Platform',
                    Subject: 'Plan de développement personnel',
                    Keywords: 'plan, étudiant, développement, carrière'
                }
            });

            // Pipe the PDF to a file
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Draw enhanced gradient header
            drawGradientHeader(doc);
            
            // Title with enhanced styling
            doc.fillColor('#ffffff')
                .fontSize(32)
                .font('Helvetica-Bold')
                .text('Mon Plan Personnalisé', PAGE_MARGIN, 50, {
                    align: 'center'
                });

            doc.fontSize(14)
                .font('Helvetica')
                .text('🚀 PlanGenerator - Automation Platform', PAGE_MARGIN, 100, {
                    align: 'center'
                });
            
            // Add date
            doc.fontSize(10)
                .text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, PAGE_MARGIN, 130, {
                    align: 'center'
                });

            // User info section (sanitized) with card-like styling
            let yPosition = 200;
            
            // Info card background
            doc.rect(PAGE_MARGIN, yPosition, doc.page.width - 2 * PAGE_MARGIN, 140)
               .fillAndStroke(COLORS.background, COLORS.textLight)
               .lineWidth(1);
            
            yPosition += 20;
            
            doc.fillColor(COLORS.text)
                .fontSize(16)
                .font('Helvetica-Bold')
                .text(`👤 ${sanitizeText(plan.name)}`, PAGE_MARGIN + 20, yPosition);

            yPosition += 25;
            doc.fontSize(11)
                .font('Helvetica')
                .fillColor(COLORS.textLight)
                .text(`📧 ${sanitizeText(plan.email)}`, PAGE_MARGIN + 20, yPosition);

            const planTypeLabels = {
                'programming': '💻 Programmation',
                'business': '💼 Business',
                'freelancing': '🚀 Freelancing',
                'content': '🎥 Création de contenu'
            };

            const timelineLabels = {
                '3months': '3 mois',
                '6months': '6 mois',
                '1year': '1 an',
                '2years': '2 ans'
            };

            yPosition += 25;
            doc.text(`📋 Type de plan: ${planTypeLabels[plan.planType] || sanitizeText(plan.planType)}`, PAGE_MARGIN + 20, yPosition);
            
            yPosition += 20;
            doc.text(`⏱️  Durée: ${timelineLabels[plan.timeline] || sanitizeText(plan.timeline)}`, PAGE_MARGIN + 20, yPosition);
            
            yPosition += 20;
            doc.text(`🎯 Domaine: ${sanitizeText(plan.field)}`, PAGE_MARGIN + 20, yPosition);

            // Add decorative separator line
            yPosition += 35;
            doc.moveTo(PAGE_MARGIN, yPosition)
                .lineTo(doc.page.width - PAGE_MARGIN, yPosition)
                .strokeColor(COLORS.primary)
                .lineWidth(3)
                .stroke();

            yPosition += 25;

            // Objective section with enhanced styling
            doc.fillColor(COLORS.primary)
                .fontSize(20)
                .font('Helvetica-Bold')
                .text('🎯 Objectif Principal', PAGE_MARGIN, yPosition);

            yPosition += 30;
            
            // Objective box
            const objectiveText = sanitizeText(plan.goal) || 'Objectif non spécifié';
            const objectiveHeight = doc.heightOfString(objectiveText, {
                width: doc.page.width - 2 * PAGE_MARGIN - 40
            }) + 30;
            
            doc.roundedRect(PAGE_MARGIN, yPosition, doc.page.width - 2 * PAGE_MARGIN, objectiveHeight, 10)
               .fillAndStroke('#f0f9ff', COLORS.info)
               .lineWidth(2);
            
            doc.fillColor(COLORS.text)
                .fontSize(12)
                .font('Helvetica')
                .text(objectiveText, PAGE_MARGIN + 20, yPosition + 15, {
                    width: doc.page.width - 2 * PAGE_MARGIN - 40,
                    align: 'justify'
                });

            yPosition += objectiveHeight + 30;

            // Roadmap phases with enhanced visual design
            const phases = getRoadmapPhases(plan);

            if (yPosition + 100 > doc.page.height - PAGE_MARGIN) {
                doc.addPage();
                yPosition = PAGE_MARGIN;
            }

            doc.fillColor(COLORS.primary)
                .fontSize(20)
                .font('Helvetica-Bold')
                .text('🗺️ Roadmap - Phases du Parcours', PAGE_MARGIN, yPosition);

            yPosition += 35;

            phases.forEach((phase, index) => {
                // Check if we need a new page
                if (yPosition + 150 > doc.page.height - PAGE_MARGIN) {
                    doc.addPage();
                    yPosition = PAGE_MARGIN;
                }

                // Phase card with colored left border
                const phaseColors = {
                    'primary': COLORS.info,
                    'info': COLORS.primary,
                    'success': COLORS.success,
                    'warning': COLORS.warning
                };
                
                const phaseColor = phaseColors[phase.color] || COLORS.info;
                
                // Calculate card height
                const tasksHeight = phase.tasks.length * 20;
                const cardHeight = tasksHeight + 70;

                // Card background
                doc.rect(PAGE_MARGIN, yPosition, doc.page.width - 2 * PAGE_MARGIN, cardHeight)
                   .fill('#ffffff');
                
                // Colored left border
                doc.rect(PAGE_MARGIN, yPosition, 5, cardHeight)
                   .fill(phaseColor);
                
                // Phase number badge
                doc.circle(PAGE_MARGIN + 30, yPosition + 20, 18)
                   .fill(phaseColor);
                
                doc.fillColor('#ffffff')
                   .fontSize(14)
                   .font('Helvetica-Bold')
                   .text(`${index + 1}`, PAGE_MARGIN + 24, yPosition + 13);

                // Phase header
                doc.fillColor(COLORS.text)
                    .fontSize(16)
                    .font('Helvetica-Bold')
                    .text(phase.title, PAGE_MARGIN + 60, yPosition + 13);

                yPosition += 40;

                doc.fillColor(COLORS.textLight)
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`⏱️  ${phase.duration}`, PAGE_MARGIN + 60, yPosition);

                yPosition += 25;

                // Tasks with checkboxes
                doc.fillColor(COLORS.text)
                    .fontSize(11)
                    .font('Helvetica');

                phase.tasks.forEach((task, taskIndex) => {
                    if (yPosition + 25 > doc.page.height - PAGE_MARGIN) {
                        doc.addPage();
                        yPosition = PAGE_MARGIN;
                    }
                    
                    // Checkbox
                    doc.rect(TASK_INDENT + 10, yPosition - 2, 10, 10)
                       .stroke(COLORS.textLight);
                    
                    doc.text(task, TASK_INDENT + 30, yPosition - 2, {
                        width: doc.page.width - TASK_INDENT - 80
                    });
                    yPosition += 20;
                });

                yPosition += 20;
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
                        .text(resource.description, SECTION_INDENT, yPosition, {
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
