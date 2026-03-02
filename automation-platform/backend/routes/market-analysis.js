const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');

// Cache for 30 minutes
const cache = new NodeCache({ stdTTL: 1800 });

/**
 * Données statiques des outils d'automatisation gratuits
 */
function getAutomationTools() {
    return [
        {
            id: 'n8n-selfhosted',
            nom: 'N8N (Self-Hosted)',
            description: 'Plateforme d\'automatisation open-source auto-hébergée, 100% gratuite sans limites',
            categorie: 'Automatisation Workflow',
            cout: {
                gratuit: true,
                tierGratuit: 'Illimité (self-hosted)',
                tierPayant: 'N8N Cloud à partir de 20€/mois',
                details: 'Self-hosted = 0€, workflows illimités, exécutions illimitées'
            },
            fonctionnalites: [
                'Workflows visuels drag-and-drop',
                'Plus de 350 intégrations natives',
                'Webhooks et triggers personnalisés',
                'Exécution conditionnelle et boucles',
                'API REST intégrée',
                'Support JavaScript/Python dans les nodes',
                'Communauté active et templates gratuits'
            ],
            limitations: [
                'Nécessite un serveur pour l\'hébergement (Docker, VPS)',
                'Configuration initiale technique requise',
                'Pas de support officiel en version gratuite'
            ],
            difficulte: 'moyen',
            guideDebut: [
                'Installer Docker sur votre machine',
                'Lancer N8N avec: docker run -it --rm -p 5678:5678 n8nio/n8n',
                'Accéder à http://localhost:5678',
                'Créer votre premier workflow avec le template "HTTP Request"',
                'Explorer la bibliothèque de templates communautaires'
            ],
            lien: 'https://n8n.io',
            idealPour: ['ETL/ELT', 'Scraping', 'Intégrations API', 'Automatisation complexe']
        },
        {
            id: 'n8n-cloud',
            nom: 'N8N Cloud (Free Tier)',
            description: 'Version cloud de N8N avec un tier gratuit pour démarrer sans infrastructure',
            categorie: 'Automatisation Workflow',
            cout: {
                gratuit: true,
                tierGratuit: '5 workflows actifs, exécutions limitées',
                tierPayant: 'À partir de 20€/mois pour plus de workflows',
                details: 'Parfait pour tester et prototyper'
            },
            fonctionnalites: [
                'Aucune installation requise',
                'Interface identique à la version self-hosted',
                'Mises à jour automatiques',
                'Hébergement sécurisé'
            ],
            limitations: [
                'Maximum 5 workflows actifs',
                'Nombre d\'exécutions limité par mois',
                'Certains nodes avancés restreints'
            ],
            difficulte: 'facile',
            guideDebut: [
                'S\'inscrire sur https://app.n8n.cloud/register',
                'Choisir le plan gratuit',
                'Suivre le tutoriel d\'onboarding',
                'Importer un template depuis la bibliothèque'
            ],
            lien: 'https://n8n.cloud',
            idealPour: ['Prototypage rapide', 'Tests', 'Petits projets']
        },
        {
            id: 'make',
            nom: 'Make (ex-Integromat)',
            description: 'Plateforme d\'automatisation visuelle avec 1000 opérations gratuites par mois',
            categorie: 'Automatisation Workflow',
            cout: {
                gratuit: true,
                tierGratuit: '1 000 opérations/mois, 2 scénarios actifs',
                tierPayant: 'À partir de 9€/mois pour 10 000 opérations',
                details: '1 000 ops suffisent pour ~30 automatisations simples/jour'
            },
            fonctionnalites: [
                'Interface visuelle intuitive',
                'Plus de 1 500 applications connectées',
                'Filtres et routeurs avancés',
                'Gestion d\'erreurs intégrée',
                'Historique des exécutions',
                'Templates prêts à l\'emploi'
            ],
            limitations: [
                '1 000 opérations/mois maximum en gratuit',
                '2 scénarios actifs maximum',
                'Transfert de données limité à 100 Mo'
            ],
            difficulte: 'facile',
            guideDebut: [
                'Créer un compte sur https://www.make.com',
                'Choisir un template dans la galerie',
                'Connecter vos applications (Google, Slack, etc.)',
                'Configurer les déclencheurs et actions',
                'Activer le scénario'
            ],
            lien: 'https://www.make.com',
            idealPour: ['Automatisations visuelles', 'Intégrations multi-apps', 'Débutants']
        },
        {
            id: 'zapier',
            nom: 'Zapier (Free)',
            description: 'Leader du marché avec 100 tâches gratuites par mois',
            categorie: 'Automatisation Workflow',
            cout: {
                gratuit: true,
                tierGratuit: '100 tâches/mois, 5 Zaps actifs',
                tierPayant: 'À partir de 19,99$/mois pour 750 tâches',
                details: '100 tâches = idéal pour 3-4 automatisations simples'
            },
            fonctionnalites: [
                'Plus de 6 000 applications connectées',
                'Interface simple et intuitive',
                'Zaps en plusieurs étapes',
                'Filtres conditionnels',
                'Formatage de données intégré'
            ],
            limitations: [
                '100 tâches/mois seulement en gratuit',
                '5 Zaps actifs maximum',
                'Pas de chemins conditionnels en gratuit',
                'Intervalle de vérification de 15 minutes'
            ],
            difficulte: 'facile',
            guideDebut: [
                'S\'inscrire sur https://zapier.com',
                'Cliquer sur "Create Zap"',
                'Choisir l\'application de déclenchement',
                'Choisir l\'action à exécuter',
                'Tester et activer le Zap'
            ],
            lien: 'https://zapier.com',
            idealPour: ['Automatisations simples', 'Débutants absolus', 'Intégrations rapides']
        },
        {
            id: 'google-apps-script',
            nom: 'Google Apps Script',
            description: 'Plateforme de scripting 100% gratuite intégrée à Google Workspace',
            categorie: 'Scripting & Automatisation',
            cout: {
                gratuit: true,
                tierGratuit: 'Entièrement gratuit avec un compte Google',
                tierPayant: 'N/A - Toujours gratuit',
                details: 'Quotas généreux: 6 min/exécution, 90 min/jour de triggers'
            },
            fonctionnalites: [
                'Intégration native avec Google Sheets, Docs, Gmail, Drive',
                'Triggers temporels (cron-like)',
                'Création de web apps gratuites',
                'API REST personnalisées',
                'Accès à des services externes via UrlFetchApp',
                'Éditeur en ligne, rien à installer'
            ],
            limitations: [
                'Limité à l\'écosystème Google principalement',
                'Temps d\'exécution max de 6 minutes par script',
                'Quotas journaliers sur certaines opérations',
                'Langage JavaScript uniquement'
            ],
            difficulte: 'facile',
            guideDebut: [
                'Ouvrir Google Sheets et créer un nouveau fichier',
                'Aller dans Extensions > Apps Script',
                'Écrire votre premier script (ex: envoi d\'email automatique)',
                'Configurer un trigger temporel',
                'Tester et déployer'
            ],
            lien: 'https://script.google.com',
            idealPour: ['Automatisation Google Workspace', 'Scraping léger', 'Emails automatiques', 'Tableaux de bord']
        },
        {
            id: 'ifttt',
            nom: 'IFTTT (If This Then That)',
            description: 'Automatisation simple avec 5 applets gratuits pour connecter vos services',
            categorie: 'Automatisation Simple',
            cout: {
                gratuit: true,
                tierGratuit: '5 applets actifs',
                tierPayant: 'IFTTT Pro à 3,49$/mois pour applets illimités',
                details: '5 applets suffisent pour des automatisations essentielles'
            },
            fonctionnalites: [
                'Interface extrêmement simple',
                'Plus de 800 services connectés',
                'Applets communautaires prêts à l\'emploi',
                'Intégration IoT et smart home',
                'Widgets mobiles'
            ],
            limitations: [
                '5 applets actifs maximum en gratuit',
                'Une seule action par applet en gratuit',
                'Pas de filtres avancés en gratuit',
                'Délai de vérification pouvant aller jusqu\'à 1 heure'
            ],
            difficulte: 'facile',
            guideDebut: [
                'Créer un compte sur https://ifttt.com',
                'Explorer les applets populaires',
                'Choisir un applet et connecter vos comptes',
                'Personnaliser les paramètres si nécessaire',
                'Activer l\'applet'
            ],
            lien: 'https://ifttt.com',
            idealPour: ['Automatisations simples', 'IoT', 'Notifications', 'Réseaux sociaux']
        },
        {
            id: 'power-automate',
            nom: 'Microsoft Power Automate',
            description: 'Outil d\'automatisation gratuit avec un compte Microsoft, idéal pour l\'écosystème Office',
            categorie: 'Automatisation Entreprise',
            cout: {
                gratuit: true,
                tierGratuit: 'Gratuit avec compte Microsoft/Office 365 éducation',
                tierPayant: 'Plans premium à partir de 15€/utilisateur/mois',
                details: 'Les étudiants ont souvent accès via leur université'
            },
            fonctionnalites: [
                'Intégration native Microsoft 365',
                'Flux de bureau (Desktop Flows) pour RPA',
                'Plus de 500 connecteurs',
                'IA Builder intégré',
                'Templates professionnels',
                'Flux d\'approbation'
            ],
            limitations: [
                'Meilleures fonctionnalités réservées aux plans payants',
                'Connecteurs premium payants',
                'Courbe d\'apprentissage pour les flux complexes',
                'Principalement orienté écosystème Microsoft'
            ],
            difficulte: 'moyen',
            guideDebut: [
                'Se connecter avec son compte Microsoft/universitaire sur https://flow.microsoft.com',
                'Explorer les templates par catégorie',
                'Choisir un flux automatisé ou instantané',
                'Configurer les connexions aux services',
                'Tester et activer le flux'
            ],
            lien: 'https://flow.microsoft.com',
            idealPour: ['Écosystème Microsoft', 'RPA', 'Flux d\'approbation', 'Entreprise']
        },
        {
            id: 'huginn',
            nom: 'Huginn',
            description: 'Système d\'agents open-source auto-hébergé pour la veille et l\'automatisation web',
            categorie: 'Veille & Scraping',
            cout: {
                gratuit: true,
                tierGratuit: 'Entièrement gratuit et open-source',
                tierPayant: 'N/A - Toujours gratuit',
                details: 'Nécessite un serveur pour l\'hébergement'
            },
            fonctionnalites: [
                'Agents autonomes pour la veille web',
                'Scraping de sites web avancé',
                'Notifications multi-canaux (email, Slack, SMS)',
                'Traitement de données et transformation',
                'Événements et triggers personnalisés',
                'API et webhooks'
            ],
            limitations: [
                'Installation technique requise (Ruby on Rails)',
                'Interface moins intuitive que les alternatives modernes',
                'Documentation parfois limitée',
                'Communauté plus petite que N8N'
            ],
            difficulte: 'moyen',
            guideDebut: [
                'Installer Docker sur votre serveur',
                'Lancer Huginn via Docker Compose',
                'Créer votre premier agent "Website Agent" pour surveiller une page',
                'Ajouter un agent de notification par email',
                'Connecter les agents entre eux'
            ],
            lien: 'https://github.com/huginn/huginn',
            idealPour: ['Veille web', 'Scraping avancé', 'Monitoring', 'Agrégation de données']
        }
    ];
}

/**
 * Templates de workflows d'automatisation pratiques pour étudiants
 */
function getWorkflowTemplates() {
    return [
        {
            id: 'scraping-prix',
            nom: 'Scraping de prix automatique',
            description: 'Surveillez automatiquement les prix de produits sur des sites e-commerce et recevez une alerte quand le prix baisse.',
            difficulte: 'facile',
            tempsCreation: '30 minutes',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N ou Make', 'Google Sheets', 'Email/Telegram'],
            etapes: [
                'Créer un nouveau workflow dans N8N ou Make',
                'Ajouter un node HTTP Request pour récupérer la page produit',
                'Extraire le prix avec un node HTML Extract / Parser',
                'Comparer avec le prix précédent stocké dans Google Sheets',
                'Envoyer une notification si le prix a baissé',
                'Configurer un trigger toutes les 6 heures'
            ],
            casUtilisation: [
                'Surveiller les prix de manuels scolaires',
                'Trouver les meilleures offres sur du matériel informatique',
                'Suivre les prix de billets de train/avion'
            ],
            revenuPotentiel: 'Service de veille prix pour clients: 50-200€/mois par client'
        },
        {
            id: 'veille-techno',
            nom: 'Veille technologique automatisée',
            description: 'Agrégez automatiquement les dernières actualités tech depuis plusieurs sources et recevez un résumé quotidien.',
            difficulte: 'facile',
            tempsCreation: '45 minutes',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N ou Google Apps Script', 'RSS Feeds', 'Email ou Notion'],
            etapes: [
                'Identifier 5-10 flux RSS de sites tech (TechCrunch, Hacker News, etc.)',
                'Créer un workflow qui lit les flux RSS chaque matin',
                'Filtrer les articles par mots-clés pertinents',
                'Formater un résumé HTML avec les titres et liens',
                'Envoyer le résumé par email ou sauvegarder dans Notion',
                'Planifier l\'exécution quotidienne à 8h du matin'
            ],
            casUtilisation: [
                'Rester informé sur les nouvelles technologies',
                'Préparer des présentations avec les dernières tendances',
                'Alimenter un blog tech avec du contenu curé'
            ],
            revenuPotentiel: 'Newsletter tech payante: 5-15€/mois par abonné'
        },
        {
            id: 'suivi-stages',
            nom: 'Suivi des opportunités de stage',
            description: 'Surveillez automatiquement les nouvelles offres de stage sur plusieurs plateformes et centralisez-les.',
            difficulte: 'facile',
            tempsCreation: '1 heure',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N ou Make', 'Google Sheets', 'Email/Slack'],
            etapes: [
                'Configurer des alertes sur LinkedIn, Indeed, Welcome to the Jungle',
                'Créer un workflow pour scraper les nouvelles offres quotidiennement',
                'Filtrer par localisation, type de contrat et compétences',
                'Ajouter les offres dans un Google Sheets centralisé',
                'Envoyer une notification pour les offres correspondant à vos critères',
                'Ajouter un suivi de candidature (postulé, entretien, résultat)'
            ],
            casUtilisation: [
                'Trouver un stage de fin d\'études',
                'Suivre les offres d\'alternance',
                'Partager les opportunités avec des camarades de promo'
            ],
            revenuPotentiel: 'Service d\'alerte stage pour étudiants: 10-30€/mois'
        },
        {
            id: 'newsletter-auto',
            nom: 'Newsletter automatique',
            description: 'Créez et envoyez automatiquement une newsletter hebdomadaire à partir de contenu agrégé.',
            difficulte: 'moyen',
            tempsCreation: '1h30',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N', 'Mailchimp ou Brevo (gratuit)', 'RSS Feeds', 'Google Sheets'],
            etapes: [
                'Configurer la collecte de contenu via RSS et scraping',
                'Stocker les articles dans Google Sheets avec catégorisation',
                'Créer un template HTML pour la newsletter',
                'Utiliser N8N pour assembler la newsletter chaque semaine',
                'Connecter à Mailchimp/Brevo pour l\'envoi (gratuit jusqu\'à 300 emails/jour)',
                'Configurer l\'envoi automatique chaque dimanche soir',
                'Ajouter un formulaire d\'inscription sur votre site'
            ],
            casUtilisation: [
                'Newsletter de veille pour votre communauté',
                'Résumé hebdomadaire pour une association étudiante',
                'Newsletter de niche sur un sujet spécifique'
            ],
            revenuPotentiel: 'Sponsoring newsletter: 50-500€ par édition (à partir de 1000 abonnés)'
        },
        {
            id: 'social-media',
            nom: 'Automatisation réseaux sociaux',
            description: 'Planifiez et publiez automatiquement du contenu sur plusieurs réseaux sociaux.',
            difficulte: 'facile',
            tempsCreation: '45 minutes',
            cout: 'Gratuit',
            outilsNecessaires: ['Make ou IFTTT', 'Buffer (gratuit) ou direct API', 'Google Sheets'],
            etapes: [
                'Préparer votre calendrier de contenu dans Google Sheets',
                'Créer un workflow qui lit le contenu planifié',
                'Adapter le format pour chaque plateforme (Twitter, LinkedIn, Instagram)',
                'Publier automatiquement aux heures optimales',
                'Collecter les statistiques d\'engagement',
                'Générer un rapport hebdomadaire de performance'
            ],
            casUtilisation: [
                'Gérer les réseaux sociaux d\'une association étudiante',
                'Promouvoir un projet personnel ou portfolio',
                'Service de community management freelance'
            ],
            revenuPotentiel: 'Community management freelance: 300-800€/mois par client'
        },
        {
            id: 'email-autoresponder',
            nom: 'Auto-répondeur email intelligent',
            description: 'Configurez des réponses automatiques personnalisées selon le contenu des emails reçus.',
            difficulte: 'moyen',
            tempsCreation: '1 heure',
            cout: 'Gratuit',
            outilsNecessaires: ['Google Apps Script', 'Gmail', 'Google Sheets'],
            etapes: [
                'Ouvrir Google Apps Script depuis Google Sheets',
                'Créer un script qui lit les emails non lus',
                'Analyser le sujet et le contenu pour catégoriser',
                'Définir des règles de réponse par catégorie',
                'Envoyer des réponses personnalisées automatiquement',
                'Logger les actions dans Google Sheets',
                'Configurer un trigger toutes les 5 minutes'
            ],
            casUtilisation: [
                'Gérer les demandes de contact professionnelles',
                'Auto-répondre aux emails d\'une association',
                'Trier et répondre aux demandes de freelance'
            ],
            revenuPotentiel: 'Configuration pour clients: 100-300€ par mise en place'
        },
        {
            id: 'portfolio-monitoring',
            nom: 'Monitoring de portfolio et projets',
            description: 'Surveillez automatiquement vos projets en ligne (uptime, performances, mentions).',
            difficulte: 'facile',
            tempsCreation: '30 minutes',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N ou Make', 'UptimeRobot (gratuit)', 'Telegram ou Email'],
            etapes: [
                'Lister vos projets et sites web à surveiller',
                'Configurer UptimeRobot pour le monitoring de base (gratuit)',
                'Créer un workflow pour vérifier les performances (temps de réponse)',
                'Surveiller les mentions de votre nom/marque sur le web',
                'Configurer des alertes en cas de problème',
                'Générer un rapport mensuel de disponibilité'
            ],
            casUtilisation: [
                'Surveiller votre portfolio en ligne',
                'Monitorer les sites de clients freelance',
                'Suivre les mentions de vos projets open-source'
            ],
            revenuPotentiel: 'Service de monitoring pour PME: 50-150€/mois par client'
        },
        {
            id: 'lead-generation',
            nom: 'Génération de leads pour freelance',
            description: 'Automatisez la recherche de clients potentiels et le premier contact pour votre activité freelance.',
            difficulte: 'moyen',
            tempsCreation: '2 heures',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N', 'Google Sheets', 'LinkedIn', 'Email'],
            etapes: [
                'Définir votre client idéal (secteur, taille, localisation)',
                'Configurer un scraping des annonces freelance (Malt, Upwork, Fiverr)',
                'Filtrer les opportunités selon vos compétences',
                'Stocker les leads dans Google Sheets avec scoring',
                'Préparer des templates de messages personnalisés',
                'Automatiser l\'envoi de propositions initiales',
                'Suivre les réponses et relances automatiques'
            ],
            casUtilisation: [
                'Trouver des missions freelance en développement web',
                'Prospecter pour du consulting en data/automatisation',
                'Développer une activité de micro-services'
            ],
            revenuPotentiel: 'Revenus freelance: 500-3000€/mois selon les missions'
        },
        {
            id: 'etl-donnees',
            nom: 'Pipeline ETL/ELT de données',
            description: 'Créez un pipeline automatisé pour extraire, transformer et charger des données entre différentes sources.',
            difficulte: 'moyen',
            tempsCreation: '1h30',
            cout: 'Gratuit',
            outilsNecessaires: ['N8N', 'Google Sheets ou PostgreSQL gratuit', 'APIs publiques'],
            etapes: [
                'Identifier les sources de données (APIs, CSV, web scraping)',
                'Créer un workflow N8N d\'extraction (HTTP Request, RSS, etc.)',
                'Ajouter des nodes de transformation (filtrage, mapping, calculs)',
                'Configurer la destination (Google Sheets, base de données)',
                'Ajouter la gestion d\'erreurs et les notifications',
                'Planifier l\'exécution régulière (quotidienne, hebdomadaire)',
                'Documenter le pipeline pour la maintenance'
            ],
            casUtilisation: [
                'Agréger des données de plusieurs APIs pour un dashboard',
                'Synchroniser des données entre applications',
                'Préparer des datasets pour des projets data science'
            ],
            revenuPotentiel: 'Consulting ETL: 400-1000€ par pipeline pour PME'
        },
        {
            id: 'backup-auto',
            nom: 'Sauvegarde automatique multi-plateformes',
            description: 'Automatisez la sauvegarde de vos données importantes depuis différentes plateformes vers un stockage centralisé.',
            difficulte: 'facile',
            tempsCreation: '45 minutes',
            cout: 'Gratuit',
            outilsNecessaires: ['Google Apps Script ou N8N', 'Google Drive', 'APIs des services'],
            etapes: [
                'Lister les données importantes à sauvegarder (Notion, Trello, GitHub, etc.)',
                'Créer un workflow pour exporter les données via API',
                'Organiser les fichiers par date dans Google Drive',
                'Configurer la rotation des sauvegardes (garder les 30 derniers jours)',
                'Ajouter une notification de confirmation après chaque sauvegarde',
                'Planifier une exécution quotidienne ou hebdomadaire'
            ],
            casUtilisation: [
                'Sauvegarder automatiquement ses projets et notes',
                'Backup des données d\'une association étudiante',
                'Service de backup pour petites entreprises'
            ],
            revenuPotentiel: 'Service de backup managé: 30-100€/mois par client'
        }
    ];
}

/**
 * Données d'analyse de marché pour étudiants en tech
 */
function getMarketData() {
    return {
        tendances: [
            {
                titre: 'Automatisation et No-Code en forte croissance',
                description: 'Le marché du no-code/low-code devrait atteindre 65 milliards de dollars en 2027. Les compétences en automatisation sont de plus en plus demandées.',
                impact: 'élevé',
                opportunitePourEtudiants: 'Les étudiants maîtrisant les outils no-code peuvent proposer des services d\'automatisation aux PME dès maintenant.'
            },
            {
                titre: 'IA et Machine Learning accessibles',
                description: 'Les APIs d\'IA (OpenAI, Hugging Face) rendent le ML accessible sans infrastructure coûteuse. Les étudiants peuvent créer des produits IA innovants.',
                impact: 'élevé',
                opportunitePourEtudiants: 'Intégrer des APIs d\'IA dans des workflows automatisés pour créer des services à haute valeur ajoutée.'
            },
            {
                titre: 'Freelance tech en expansion',
                description: 'Le marché du freelance tech en France croît de 15% par an. Les plateformes comme Malt facilitent l\'accès aux missions.',
                impact: 'élevé',
                opportunitePourEtudiants: 'Commencer en freelance pendant les études pour construire un portfolio et un réseau professionnel.'
            },
            {
                titre: 'Data Engineering et ETL',
                description: 'La demande en data engineers explose. Les compétences ETL/ELT sont parmi les plus recherchées du marché.',
                impact: 'élevé',
                opportunitePourEtudiants: 'Apprendre les pipelines de données avec des outils gratuits (N8N, Apache Airflow) pour se positionner sur ce marché.'
            },
            {
                titre: 'Cybersécurité et automatisation',
                description: 'La cybersécurité manque cruellement de talents. L\'automatisation des processus de sécurité est un domaine en plein essor.',
                impact: 'moyen',
                opportunitePourEtudiants: 'Se former en cybersécurité et automatiser les audits de sécurité basiques pour les PME.'
            }
        ],
        competencesDemandees: [
            { competence: 'Python', demande: 'Très élevée', salaireJunior: '35 000 - 42 000€/an', tarifFreelance: '350-500€/jour' },
            { competence: 'JavaScript/TypeScript', demande: 'Très élevée', salaireJunior: '33 000 - 40 000€/an', tarifFreelance: '300-450€/jour' },
            { competence: 'React/Vue.js', demande: 'Élevée', salaireJunior: '35 000 - 43 000€/an', tarifFreelance: '350-500€/jour' },
            { competence: 'Data Science / ML', demande: 'Élevée', salaireJunior: '38 000 - 48 000€/an', tarifFreelance: '400-600€/jour' },
            { competence: 'DevOps / Cloud', demande: 'Élevée', salaireJunior: '37 000 - 45 000€/an', tarifFreelance: '400-550€/jour' },
            { competence: 'No-Code / Automatisation', demande: 'En croissance', salaireJunior: '30 000 - 38 000€/an', tarifFreelance: '250-400€/jour' },
            { competence: 'Cybersécurité', demande: 'Très élevée', salaireJunior: '38 000 - 46 000€/an', tarifFreelance: '450-650€/jour' },
            { competence: 'SQL / Bases de données', demande: 'Élevée', salaireJunior: '33 000 - 40 000€/an', tarifFreelance: '300-450€/jour' }
        ],
        coutsOutilsEtudiants: [
            { outil: 'GitHub Pro', coutNormal: '4$/mois', coutEtudiant: 'Gratuit (GitHub Student Pack)', economie: '48$/an' },
            { outil: 'JetBrains IDEs', coutNormal: '149€/an', coutEtudiant: 'Gratuit (licence éducation)', economie: '149€/an' },
            { outil: 'Figma', coutNormal: '12$/mois', coutEtudiant: 'Gratuit (plan éducation)', economie: '144$/an' },
            { outil: 'Notion', coutNormal: '8$/mois', coutEtudiant: 'Gratuit (plan éducation)', economie: '96$/an' },
            { outil: 'AWS Educate', coutNormal: 'Variable', coutEtudiant: 'Crédits gratuits (100$+)', economie: '100$+' },
            { outil: 'Microsoft Azure', coutNormal: 'Variable', coutEtudiant: '100$ de crédits gratuits', economie: '100$' },
            { outil: 'Canva Pro', coutNormal: '12,99€/mois', coutEtudiant: 'Gratuit (via GitHub Student Pack)', economie: '155€/an' },
            { outil: 'Heroku / Railway', coutNormal: '7$/mois', coutEtudiant: 'Tiers gratuits disponibles', economie: '84$/an' }
        ],
        recommandationsETL: [
            {
                outil: 'N8N',
                type: 'ETL visuel',
                cout: 'Gratuit (self-hosted)',
                description: 'Idéal pour les pipelines ETL visuels. Parfait pour les étudiants grâce à son interface intuitive.',
                avantages: ['Gratuit et open-source', 'Interface visuelle', '350+ connecteurs', 'Support JavaScript'],
                niveauRecommande: 'Débutant à Intermédiaire'
            },
            {
                outil: 'Apache Airflow',
                type: 'Orchestrateur ETL',
                cout: 'Gratuit (open-source)',
                description: 'Standard de l\'industrie pour l\'orchestration de pipelines de données. Excellent pour le CV.',
                avantages: ['Standard industriel', 'Python natif', 'Communauté massive', 'Très demandé en entreprise'],
                niveauRecommande: 'Intermédiaire'
            },
            {
                outil: 'dbt (data build tool)',
                type: 'Transformation ELT',
                cout: 'Gratuit (dbt Core)',
                description: 'Outil de transformation de données basé sur SQL. Très populaire dans l\'écosystème data moderne.',
                avantages: ['SQL uniquement', 'Tests intégrés', 'Documentation automatique', 'Très demandé'],
                niveauRecommande: 'Débutant à Intermédiaire'
            },
            {
                outil: 'Airbyte',
                type: 'Extraction ELT',
                cout: 'Gratuit (open-source)',
                description: 'Plateforme d\'intégration de données open-source avec 300+ connecteurs pré-construits.',
                avantages: ['300+ connecteurs', 'Open-source', 'Interface intuitive', 'Communauté active'],
                niveauRecommande: 'Débutant'
            }
        ]
    };
}

/**
 * GET /api/market-analysis
 * Retourne l'analyse de marché complète
 */
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'market_analysis_full';

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                cached: true
            });
        }

        const data = {
            outilsAutomatisation: getAutomationTools(),
            workflowTemplates: getWorkflowTemplates(),
            analyseMarche: getMarketData(),
            metadata: {
                derniereMiseAJour: new Date().toISOString(),
                version: '1.0.0',
                langue: 'fr'
            }
        };

        cache.set(cacheKey, data);

        res.json({
            success: true,
            data,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching market analysis:', error.message);
        res.status(500).json({
            success: false,
            error: 'Échec de la récupération de l\'analyse de marché'
        });
    }
});

/**
 * GET /api/market-analysis/tools
 * Retourne la liste détaillée des outils d'automatisation gratuits
 */
router.get('/tools', async (req, res) => {
    try {
        const cacheKey = 'market_analysis_tools';
        const { difficulte, categorie } = req.query;

        // Validate query parameters
        const allowedDifficultes = ['facile', 'moyen', 'avance'];
        if (difficulte && !allowedDifficultes.includes(difficulte)) {
            return res.status(400).json({
                success: false,
                error: 'Paramètre difficulte invalide. Valeurs acceptées: facile, moyen, avance'
            });
        }
        if (categorie && !/^[a-zA-ZÀ-ÿ0-9\s-]+$/.test(categorie)) {
            return res.status(400).json({
                success: false,
                error: 'Paramètre categorie invalide'
            });
        }

        const cachedData = cache.get(cacheKey);
        let tools;

        if (cachedData) {
            tools = cachedData;
        } else {
            tools = getAutomationTools();
            cache.set(cacheKey, tools);
        }

        // Filtrage optionnel
        if (difficulte) {
            tools = tools.filter(t => t.difficulte === difficulte);
        }
        if (categorie) {
            tools = tools.filter(t => t.categorie.toLowerCase().includes(categorie.toLowerCase()));
        }

        res.json({
            success: true,
            tools,
            count: tools.length,
            cached: !!cachedData
        });
    } catch (error) {
        console.error('Error fetching automation tools:', error.message);
        res.status(500).json({
            success: false,
            error: 'Échec de la récupération des outils'
        });
    }
});

/**
 * GET /api/market-analysis/automations
 * Retourne les templates de workflows d'automatisation
 */
router.get('/automations', async (req, res) => {
    try {
        const cacheKey = 'market_analysis_automations';
        const { difficulte } = req.query;

        // Validate query parameter
        const allowedDifficultes = ['facile', 'moyen', 'avance'];
        if (difficulte && !allowedDifficultes.includes(difficulte)) {
            return res.status(400).json({
                success: false,
                error: 'Paramètre difficulte invalide. Valeurs acceptées: facile, moyen, avance'
            });
        }

        const cachedData = cache.get(cacheKey);
        let workflows;

        if (cachedData) {
            workflows = cachedData;
        } else {
            workflows = getWorkflowTemplates();
            cache.set(cacheKey, workflows);
        }

        // Filtrage optionnel par difficulté
        if (difficulte) {
            workflows = workflows.filter(w => w.difficulte === difficulte);
        }

        res.json({
            success: true,
            workflows,
            count: workflows.length,
            cached: !!cachedData
        });
    } catch (error) {
        console.error('Error fetching automation workflows:', error.message);
        res.status(500).json({
            success: false,
            error: 'Échec de la récupération des workflows'
        });
    }
});

module.exports = router;
