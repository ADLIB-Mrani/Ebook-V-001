# Guide d'Intégration des APIs Externes

Ce document décrit les APIs externes qui peuvent être intégrées pour enrichir les opportunités et ressources dynamiques de PlanGenerator.

## 📋 Table des Matières

1. [APIs Actuellement Disponibles](#apis-actuellement-disponibles)
2. [APIs Recommandées à Intégrer](#apis-recommandées-à-intégrer)
3. [Configuration et Clés d'API](#configuration-et-clés-dapi)
4. [Guide d'Implémentation](#guide-dimplémentation)

---

## 🔗 APIs Actuellement Disponibles

### Web Scraping (Implémenté)
- **Devpost** - Hackathons en cours
  - Fichier: `backend/services/scraper.js`
  - Méthode: Web scraping avec Cheerio
  - Données: Titre, URL, dates des hackathons

### Données Statiques (Implémenté)
- Base de données de 90+ ressources par catégorie
- Opportunités par type de plan (bourses, compétitions, programmes)

---

## 🚀 APIs Recommandées à Intégrer

### 1. GitHub API (Gratuit)
**Utilité**: Récupérer les repos tendance, jobs GitHub, projets open source

**Inscription**: https://github.com/settings/tokens

**Étapes**:
1. Connectez-vous à GitHub
2. Allez dans Settings > Developer settings > Personal access tokens
3. Créez un token avec les scopes: `public_repo`, `read:user`
4. Ajoutez `GITHUB_TOKEN` dans `.env`

**Endpoints utiles**:
```javascript
// Repos tendance
GET https://api.github.com/search/repositories?q=language:python&sort=stars

// Jobs GitHub
GET https://api.github.com/search/repositories?q=topic:jobs
```

---

### 2. Devpost API (Gratuit - via scraping)
**Utilité**: Hackathons en cours et à venir

**Implémentation**: Déjà présent dans `scraper.js`

**Amélioration possible**:
```javascript
// Ajouter plus de filtres
const url = 'https://devpost.com/hackathons?status=upcoming&order_by=deadline';
```

---

### 3. LinkedIn Learning API (Payant - LinkedIn Marketing Solutions)
**Utilité**: Cours et formations professionnelles

**Inscription**: https://business.linkedin.com/marketing-solutions

**Note**: Nécessite un compte business LinkedIn

---

### 4. Coursera Catalog API (Gratuit pour affiliés)
**Utilité**: Cours en ligne des universités

**Inscription**: https://www.coursera.org/affiliate

**Étapes**:
1. S'inscrire au programme d'affiliation Coursera
2. Obtenir les clés API dans le dashboard
3. Ajouter `COURSERA_API_KEY` dans `.env`

**Endpoint**:
```javascript
GET https://api.coursera.org/api/catalog.v1/courses
```

---

### 5. RapidAPI - Collection d'APIs
**Utilité**: Accès à des centaines d'APIs (jobs, cours, news tech)

**Inscription**: https://rapidapi.com/

**APIs recommandées sur RapidAPI**:
- **JSearch**: Jobs tech (Indeed, LinkedIn, Glassdoor)
- **Udemy Affiliate**: Cours Udemy
- **News API**: Actualités tech

**Étapes**:
1. Créer un compte RapidAPI gratuit
2. S'abonner aux APIs (beaucoup ont un tier gratuit)
3. Copier la clé `X-RapidAPI-Key`
4. Ajouter `RAPIDAPI_KEY` dans `.env`

---

### 6. Meetup API (Gratuit)
**Utilité**: Événements tech et networking locaux

**Inscription**: https://www.meetup.com/api/

**Étapes**:
1. Créer un compte Meetup
2. Aller sur https://secure.meetup.com/meetup_api/key/
3. Générer une clé API
4. Ajouter `MEETUP_API_KEY` dans `.env`

**Endpoint**:
```javascript
GET https://api.meetup.com/find/groups?category=34&radius=50
// category 34 = Technology
```

---

### 7. Eventbrite API (Gratuit)
**Utilité**: Événements, conférences tech

**Inscription**: https://www.eventbrite.com/platform/api

**Étapes**:
1. Créer un compte Eventbrite
2. Aller dans Account Settings > Developer Links
3. Créer une nouvelle application
4. Copier le Private Token
5. Ajouter `EVENTBRITE_TOKEN` dans `.env`

**Endpoint**:
```javascript
GET https://www.eventbriteapi.com/v3/events/search/?categories=102
// category 102 = Science & Technology
```

---

### 8. ProductHunt API (Gratuit)
**Utilité**: Nouveaux produits tech, startups tendance

**Inscription**: https://www.producthunt.com/v2/oauth/applications

**Étapes**:
1. Créer un compte ProductHunt
2. Créer une application dans les settings
3. Obtenir `client_id` et `client_secret`
4. Ajouter dans `.env`

---

### 9. Indeed API (via RapidAPI - JSearch)
**Utilité**: Offres d'emploi et stages tech

**Inscription**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

**Tier gratuit**: 500 requêtes/mois

---

### 10. Kaggle API (Gratuit)
**Utilité**: Compétitions data science, datasets

**Inscription**: https://www.kaggle.com/account

**Étapes**:
1. Créer un compte Kaggle
2. Aller dans Account > API
3. Créer un nouveau token API
4. Télécharger `kaggle.json`
5. Ajouter les credentials dans `.env`

---

## ⚙️ Configuration et Clés d'API

### Fichier `.env` recommandé

```env
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# RapidAPI (pour JSearch, news, etc.)
RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Coursera Affiliate
COURSERA_API_KEY=xxxxxxxxxx

# Meetup
MEETUP_API_KEY=xxxxxxxxxx

# Eventbrite
EVENTBRITE_TOKEN=xxxxxxxxxx

# Kaggle
KAGGLE_USERNAME=your_username
KAGGLE_KEY=xxxxxxxxxx

# ProductHunt
PRODUCTHUNT_CLIENT_ID=xxxxxxxxxx
PRODUCTHUNT_CLIENT_SECRET=xxxxxxxxxx
```

---

## 🛠️ Guide d'Implémentation

### Exemple: Intégrer GitHub Trending Repos

```javascript
// backend/services/github.js
const axios = require('axios');

const getGitHubTrending = async (language = 'javascript') => {
    try {
        const response = await axios.get(
            `https://api.github.com/search/repositories`,
            {
                params: {
                    q: `language:${language}`,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 10
                },
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        return response.data.items.map(repo => ({
            type: 'Projet Open Source',
            title: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            source: 'GitHub',
            categories: ['programming'],
            keywords: ['open source', language]
        }));
    } catch (error) {
        console.error('GitHub API error:', error.message);
        return [];
    }
};

module.exports = { getGitHubTrending };
```

### Exemple: Intégrer des Jobs via JSearch (RapidAPI)

```javascript
// backend/services/jobs.js
const axios = require('axios');

const searchJobs = async (query, location = 'France') => {
    try {
        const response = await axios.get(
            'https://jsearch.p.rapidapi.com/search',
            {
                params: {
                    query: query,
                    page: '1',
                    num_pages: '1'
                },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            }
        );
        
        return response.data.data.map(job => ({
            type: 'Emploi/Stage',
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city,
            url: job.job_apply_link,
            source: 'JSearch',
            deadline: job.job_posted_at_datetime_utc
        }));
    } catch (error) {
        console.error('JSearch API error:', error.message);
        return [];
    }
};

module.exports = { searchJobs };
```

### Exemple: Intégrer dans le Scraper Principal

```javascript
// backend/services/scraper.js - Mise à jour
const { getGitHubTrending } = require('./github');
const { searchJobs } = require('./jobs');

const scrapeOpportunities = async (planType = 'programming') => {
    const opportunities = [];
    
    try {
        // Hackathons Devpost
        const hackathons = await scrapeDevpost();
        opportunities.push(...hackathons);
        
        // GitHub trending (si API configurée)
        if (process.env.GITHUB_TOKEN) {
            const repos = await getGitHubTrending('javascript');
            opportunities.push(...repos);
        }
        
        // Jobs (si RapidAPI configurée)
        if (process.env.RAPIDAPI_KEY) {
            const jobs = await searchJobs(`${planType} internship`);
            opportunities.push(...jobs);
        }
        
    } catch (error) {
        console.error('Error scraping opportunities:', error);
    }
    
    // Fallback sur les données statiques
    opportunities.push(...getStaticOpportunities());
    
    return opportunities;
};
```

---

## 📊 Résumé des APIs

| API | Gratuit | Données | Difficulté |
|-----|---------|---------|------------|
| GitHub | ✅ Oui | Repos, users | Facile |
| Devpost | ✅ Oui (scraping) | Hackathons | Facile |
| RapidAPI/JSearch | ✅ 500 req/mois | Jobs | Moyen |
| Coursera | ✅ Pour affiliés | Cours | Moyen |
| Meetup | ✅ Oui | Événements | Facile |
| Eventbrite | ✅ Oui | Événements | Facile |
| ProductHunt | ✅ Oui | Produits | Moyen |
| Kaggle | ✅ Oui | Compétitions ML | Facile |

---

## 🔒 Bonnes Pratiques de Sécurité

1. **Ne jamais commiter les clés API** dans le code
2. Utiliser des **variables d'environnement** (`.env`)
3. Ajouter `.env` dans `.gitignore`
4. Utiliser des **rate limiters** pour respecter les quotas
5. **Cacher les réponses** pour réduire les appels API
6. Implémenter des **fallbacks** en cas d'erreur API

---

## 📝 Notes Importantes

- La plupart des APIs ont un **tier gratuit** suffisant pour un usage modéré
- Certaines APIs comme RapidAPI regroupent plusieurs services sous une seule clé
- Le **web scraping** reste une option viable pour les sites sans API (respecter les ToS)
- Pensez à implémenter un **système de cache** (Redis, fichiers JSON) pour réduire les appels

---

## 🚀 Prochaines Étapes

1. Créer les comptes sur les plateformes choisies
2. Générer les clés API
3. Ajouter les clés dans le fichier `.env`
4. Implémenter les services correspondants
5. Intégrer dans le scraper principal
6. Tester et ajuster les filtres

Pour toute question, ouvrir une issue sur le repository GitHub.
