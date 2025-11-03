# Plateforme d'Automatisation de Plans Personnalisés

## 🎯 Objectif

Créer une plateforme web où les utilisateurs remplissent un formulaire sur leur situation et objectifs, puis reçoivent automatiquement :
- Une page web dynamique personnalisée
- Des visuels (roadmaps, diagrammes de Gantt, graphiques)
- Des mises à jour automatiques sur les nouvelles opportunités
- Des notifications par email

## 🛠️ Technologies Utilisées (100% Gratuites via GitHub Student Pack)

### Frontend
- **HTML/CSS/JavaScript** : Interface utilisateur
- **Bootstrap 5** : Framework CSS responsive
- **Chart.js** : Graphiques et visualisations
- **Mermaid.js** : Diagrammes et roadmaps
- **Vercel** : Hébergement gratuit (GitHub Student Pack)

### Backend
- **Node.js + Express** : Serveur API
- **MongoDB Atlas** : Base de données (tier gratuit)
- **GitHub Actions** : Automatisation des mises à jour
- **Netlify Functions** : Serverless functions (gratuit)

### Email & Notifications
- **SendGrid** : 100 emails/jour gratuits (GitHub Student Pack)
- **Mailgun** : Alternative email gratuite

### PDF Generation
- **jsPDF** : Génération PDF côté client
- **Puppeteer** : Génération PDF côté serveur

### Stockage
- **GitHub Pages** : Pages statiques personnalisées
- **Vercel** : Déploiement automatique
- **Cloudinary** : Stockage images (gratuit)

## 📋 Fonctionnalités

### 1. Formulaire Dynamique
- Informations personnelles (âge, niveau d'études, budget)
- Objectifs (apprentissage programmation, business, etc.)
- Compétences actuelles
- Contraintes de temps
- Intérêts et passions

### 2. Génération de Contenu Personnalisé
- **Page Web Dynamique** : URL unique pour chaque utilisateur
- **PDF Téléchargeable** : Plan complet en format portable
- **Roadmap Interactive** : Visualisation du parcours
- **Diagramme de Gantt** : Timeline des tâches
- **Checklist Progressive** : Objectifs et sous-objectifs

### 3. Mises à Jour Automatiques
- **Scraping d'Opportunités** : Nouvelles bourses, hackathons, emplois
- **Notifications Email** : Alertes personnalisées
- **Actualisation Automatique** : Page mise à jour quotidiennement
- **Feed RSS** : Nouvelles ressources

### 4. Outils Visuels
- **Diagrammes de Gantt** : Planning temporel
- **Roadmaps** : Parcours d'apprentissage
- **Graphiques de Progression** : Suivi des objectifs
- **Mind Maps** : Organisation des idées
- **Calendrier Intégré** : Événements et deadlines

## 🚀 Architecture

```
automation-platform/
├── frontend/               # Application web frontale
│   ├── index.html         # Page d'accueil
│   ├── form.html          # Formulaire utilisateur
│   ├── dashboard.html     # Dashboard personnalisé
│   ├── css/
│   │   └── styles.css     # Styles personnalisés
│   └── js/
│       ├── form.js        # Logique formulaire
│       ├── generator.js   # Génération contenu
│       ├── charts.js      # Graphiques
│       └── pdf.js         # Export PDF
├── backend/               # Serveur et API
│   ├── server.js          # Serveur Express
│   ├── routes/
│   │   ├── user.js        # Routes utilisateur
│   │   └── updates.js     # Routes mises à jour
│   ├── models/
│   │   └── User.js        # Modèle utilisateur
│   ├── services/
│   │   ├── scraper.js     # Scraping opportunités
│   │   ├── email.js       # Service email
│   │   └── generator.js   # Génération contenu
│   └── utils/
│       └── templates.js   # Templates de plans
├── config/                # Configuration
│   ├── plans/             # Templates de plans
│   │   ├── programming.json
│   │   ├── business.json
│   │   └── ...
│   └── opportunities.json # Sources d'opportunités
└── .github/
    └── workflows/
        └── update.yml     # Workflow mises à jour auto
```

## 📝 Guide d'Installation

### Prérequis
- Node.js 18+ (gratuit)
- Compte GitHub (pour Student Pack)
- Email universitaire (pour accès gratuit)

### Étape 1 : Configuration GitHub Student Pack
1. Aller sur https://education.github.com/pack
2. Vérifier email universitaire
3. Activer les services :
   - Vercel
   - MongoDB Atlas
   - SendGrid
   - DigitalOcean (100$ crédits)
   - Heroku (alternative hébergement)

### Étape 2 : Installation Locale
```bash
cd automation-platform
npm install
```

### Étape 3 : Configuration
```bash
cp .env.example .env
# Éditer .env avec tes clés API
```

### Étape 4 : Lancement
```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

### Étape 5 : Déploiement
```bash
# Vercel (recommandé)
vercel deploy

# Ou Netlify
netlify deploy
```

## 🔧 Configuration des Services

### MongoDB Atlas (Base de données)
1. Créer compte sur mongodb.com
2. Cluster gratuit (512MB)
3. Copier connection string
4. Ajouter dans .env : `MONGODB_URI=...`

### SendGrid (Emails)
1. Activer via GitHub Student Pack
2. Vérifier domaine ou email
3. Générer API Key
4. Ajouter dans .env : `SENDGRID_API_KEY=...`

### Vercel (Hébergement)
1. Connecter repo GitHub
2. Déploiement automatique
3. Variables d'environnement dans dashboard

## 📊 Exemples de Plans Générés

### Plan "Apprentissage Programmation"
- Évaluation niveau actuel
- Roadmap sur 6-12 mois
- Ressources gratuites (FreeCodeCamp, The Odin Project)
- Projets pratiques
- Checklist compétences
- Opportunités (hackathons, stages)
- Diagramme de Gantt des étapes

### Plan "Lancer un Business"
- Validation d'idée
- Étapes création micro-entreprise
- Budget et prévisionnel
- Ressources PEPITE
- Timeline de lancement
- KPIs à suivre
- Opportunités de financement

### Plan "Freelancing"
- Compétences à développer
- Plateformes (Malt, Upwork)
- Construction portfolio
- Tarification
- Premiers clients
- Timeline 0-6 mois

## 🎨 Personnalisation

### Templates de Plans
Chaque plan est défini dans `config/plans/` en JSON :

```json
{
  "id": "programming",
  "title": "Maîtriser la Programmation",
  "duration": "6-12 mois",
  "steps": [
    {
      "phase": "Fondations",
      "duration": "2 mois",
      "tasks": [...],
      "resources": [...]
    }
  ],
  "milestones": [...],
  "kpis": [...]
}
```

### Sources d'Opportunités
Configurées dans `config/opportunities.json` :

```json
{
  "sources": [
    {
      "type": "hackathons",
      "url": "https://devpost.com/hackathons",
      "frequency": "daily"
    },
    {
      "type": "scholarships",
      "url": "https://www.service-public.fr/particuliers/vosdroits/N67",
      "frequency": "weekly"
    }
  ]
}
```

## 🔄 Système de Mises à Jour

### GitHub Actions Workflow
Exécuté quotidiennement pour :
1. Scraper nouvelles opportunités
2. Mettre à jour les plans utilisateurs
3. Envoyer notifications email
4. Actualiser pages dynamiques

### Notifications
- Email hebdomadaire avec nouvelles ressources
- Alertes opportunités correspondant au profil
- Rappels jalons importants
- Actualités secteur

## 🎯 Roadmap Développement

### Phase 1 : MVP (2-3 semaines)
- [x] Architecture de base
- [ ] Formulaire simple (3-4 plans prédéfinis)
- [ ] Génération page statique
- [ ] Export PDF basique
- [ ] Déploiement Vercel

### Phase 2 : Dynamique (1 mois)
- [ ] Base de données MongoDB
- [ ] Pages dynamiques par utilisateur
- [ ] Système d'authentification
- [ ] Dashboard personnalisé
- [ ] Emails automatiques

### Phase 3 : Visualisations (2 semaines)
- [ ] Diagrammes de Gantt
- [ ] Roadmaps interactives
- [ ] Graphiques progression
- [ ] Mind maps
- [ ] Calendrier intégré

### Phase 4 : Automatisation (1 mois)
- [ ] Scraping opportunités
- [ ] Mises à jour automatiques
- [ ] Notifications intelligentes
- [ ] Recommandations IA

### Phase 5 : Avancé (futur)
- [ ] Saisie libre (NLP pour analyser)
- [ ] IA générative pour plans
- [ ] Communauté utilisateurs
- [ ] Suivi progression temps réel
- [ ] App mobile

## 💡 Idées d'Amélioration

### Court Terme (Gratuit)
- Intégration calendrier Google/Outlook
- Export formats multiples (Markdown, Notion)
- Templates personnalisables
- Mode hors ligne (PWA)
- Multi-langue

### Long Terme (Payant si budget)
- OpenAI API pour génération IA
- Twilio pour SMS
- Analytics avancés (Mixpanel)
- CDN premium (Cloudflare)
- Support client (Intercom)

## 📈 Monétisation Future

### Version Gratuite
- Plans prédéfinis basiques
- 1 mise à jour par semaine
- Export PDF simple
- Email hebdomadaire

### Version Premium (5-10€/mois)
- Plans illimités personnalisés
- Mises à jour quotidiennes
- Tous exports (PDF, Notion, etc.)
- Notifications prioritaires
- Support prioritaire
- Accès API

## 🔐 Sécurité & Confidentialité

- Données chiffrées (MongoDB)
- Authentification sécurisée (JWT)
- RGPD compliant
- Suppression données sur demande
- Pas de vente de données
- Hébergement EU (Vercel)

## 📚 Documentation

- [Guide Utilisateur](docs/user-guide.md)
- [Documentation API](docs/api.md)
- [Guide Développeur](docs/developer.md)
- [FAQ](docs/faq.md)

## 🤝 Contribution

Ce projet est open-source. Contributions bienvenues !

## 📄 Licence

MIT License - Utilisation libre

---

**Prêt à automatiser la création de plans personnalisés ! 🚀**
