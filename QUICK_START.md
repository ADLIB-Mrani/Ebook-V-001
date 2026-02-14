# 🚀 Guide de Démarrage Rapide

## Installation

### Prérequis
- Node.js 16+ installé
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/ADLIB-Mrani/Ebook-V-001.git
cd Ebook-V-001/automation-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement (optionnel)**
```bash
cp .env.example .env
# Éditer .env avec vos clés API si vous en avez
```

4. **Lancer le serveur**
```bash
npm start
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## Fonctionnalités Principales

### 1. Génération de Plans Personnalisés
- Remplir le formulaire sur `/form.html`
- Générer un plan adapté à vos objectifs
- Télécharger en PDF

### 2. Opportunités
- Parcourir les opportunités sur `/opportunities.html`
- Utiliser les filtres par catégorie
- Rechercher par mot-clé
- Sauvegarder vos favoris

### 3. Dashboard
- Suivre votre progression
- Gérer vos tâches
- Voir vos statistiques

## Configuration Avancée

### MongoDB (Base de données)
Pour activer la persistence :
1. Créer un compte MongoDB Atlas (gratuit)
2. Créer un cluster
3. Copier la connection string
4. Ajouter dans `.env` :
```
MONGODB_URI=mongodb+srv://...
```

### Email (Notifications)
Pour activer les emails :
1. Créer un compte SendGrid (gratuit)
2. Générer une API key
3. Ajouter dans `.env` :
```
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@votredomaine.com
```

### Firecrawl (Scraping avancé)
Pour améliorer le scraping :
1. Créer un compte sur firecrawl.dev
2. Copier la clé API
3. Ajouter dans `.env` :
```
FIRECRAWL_API_KEY=xxx
```

## Architecture du Projet

```
automation-platform/
├── backend/
│   ├── server.js           # Serveur Express
│   ├── models/             # Modèles MongoDB
│   ├── routes/             # Routes API
│   └── services/           # Services (PDF, scraping, email)
├── frontend/
│   ├── index.html          # Page d'accueil
│   ├── opportunities.html  # Page opportunités
│   ├── form.html          # Formulaire
│   ├── js/                # Scripts JavaScript
│   └── css/               # Styles
└── package.json
```

## API Endpoints

### Opportunités
- `GET /api/opportunities` - Liste des opportunités
- `GET /api/opportunities/categories` - Catégories
- `GET /api/opportunities/types` - Types
- `POST /api/opportunities/refresh` - Actualiser

### Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/me` - Profil

### Statistiques
- `GET /api/stats/public` - Stats publiques
- `GET /api/stats/quote` - Citation du jour

## Scripts npm

```bash
npm start       # Démarrer le serveur
npm run dev     # Mode développement (avec nodemon)
npm test        # Tests (à implémenter)
```

## Déploiement

### Render.com (Gratuit)
1. Connecter votre repo GitHub
2. Configurer :
   - Build Command: `cd automation-platform && npm install`
   - Start Command: `cd automation-platform && npm start`
3. Ajouter les variables d'environnement
4. Déployer !

### Railway.app (Gratuit)
1. Connecter GitHub
2. Sélectionner le repo
3. Railway détecte automatiquement
4. Ajouter les variables d'environnement
5. Déployer !

## Support

Pour toute question :
- Issues GitHub
- Email : support@planGenerator.com (à configurer)
- Discord : (à venir)

## Licence

MIT - Libre d'utilisation pour étudiants
