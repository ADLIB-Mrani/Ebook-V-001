# 🚀 Guide de Configuration - PlanGenerator

Ce guide t'explique comment configurer et déployer la plateforme PlanGenerator.

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Compte GitHub (pour le Student Pack)
- Compte email (Gmail, Outlook, etc.)

## ⚙️ Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/ADLIB-Mrani/Ebook-V-001.git
cd Ebook-V-001/automation-platform
```

### 2. Installer les Dépendances

```bash
npm install
```

## 📧 Configuration de l'Envoi d'Emails

### Option 1: SendGrid (Recommandé)

SendGrid offre 100 emails/jour gratuits avec le GitHub Student Pack.

1. **Créer un compte SendGrid:**
   - Va sur [SendGrid](https://sendgrid.com/)
   - Clique sur "Try for Free" ou utilise le GitHub Student Pack
   - Vérifie ton email

2. **Obtenir une API Key:**
   - Dashboard → Settings → API Keys
   - Crée une nouvelle API Key avec "Full Access"
   - **Important:** Copie la clé immédiatement (elle ne sera plus visible)

3. **Configurer l'Application:**
   
   Crée un fichier `.env` à la racine de `automation-platform/` :

   ```env
   # SendGrid Configuration
   SENDGRID_API_KEY=ton_api_key_ici
   FROM_EMAIL=ton@email.com
   
   # Frontend URL (pour les liens dans les emails)
   FRONTEND_URL=http://localhost:3000
   
   # MongoDB (optionnel, laisse vide pour le mode démo)
   MONGODB_URI=
   
   # Port du serveur
   PORT=3000
   ```

4. **Vérifier le domaine (optionnel mais recommandé):**
   - SendGrid → Settings → Sender Authentication
   - Vérifie ton email ou domaine pour éviter que les emails tombent en spam

### Option 2: Gmail SMTP (Alternative)

Si tu préfères utiliser Gmail:

1. **Activer "Applications moins sécurisées"** ou créer un **mot de passe d'application**
   - Va sur myaccount.google.com/security
   - Crée un mot de passe d'application

2. **Installer nodemailer-smtp-transport:**
   ```bash
   npm install nodemailer-smtp-transport
   ```

3. **Modifier `backend/services/email.js`:**

   Remplace la configuration SendGrid par:

   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: process.env.GMAIL_USER,
           pass: process.env.GMAIL_PASSWORD // Mot de passe d'application
       }
   });
   
   const sendWelcomeEmail = async (email, name, plan) => {
       const mailOptions = {
           from: process.env.GMAIL_USER,
           to: email,
           subject: `Bienvenue ${name} ! Ton plan est prêt`,
           html: generateWelcomeEmailHTML(name, plan)
       };
       
       await transporter.sendMail(mailOptions);
   };
   ```

4. **Ajouter dans `.env`:**
   ```env
   GMAIL_USER=ton@gmail.com
   GMAIL_PASSWORD=ton_mot_de_passe_application
   ```

## 🗄️ Configuration de la Base de Données (Optionnel)

La plateforme fonctionne en mode démo sans base de données (localStorage). Pour sauvegarder les données en ligne:

### MongoDB Atlas (Gratuit)

1. **Créer un compte:**
   - Va sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crée un compte gratuit (Tier M0 - 512MB gratuit)

2. **Créer un Cluster:**
   - Choisis un provider (AWS, GCP, Azure)
   - Sélectionne une région proche (ex: Paris, Frankfurt)
   - Clique sur "Create Cluster"

3. **Configuration de la sécurité:**
   - Database Access → Add New Database User
   - Crée un utilisateur avec un mot de passe
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

4. **Obtenir l'URI de connexion:**
   - Clusters → Connect → Connect your application
   - Copie l'URI de connexion
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

5. **Ajouter dans `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plangenerator?retryWrites=true&w=majority
   ```

## 🚀 Lancement Local

```bash
# Développement
npm run dev

# Production
npm start
```

L'application sera accessible sur http://localhost:3000

## 📦 Déploiement

### Vercel (Recommandé - Gratuit)

1. **Installer Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Déployer:**
   ```bash
   vercel
   ```

3. **Configurer les variables d'environnement:**
   - Dashboard Vercel → Settings → Environment Variables
   - Ajoute toutes les variables du fichier `.env`

### Heroku (Alternative)

1. **Créer un compte Heroku** (gratuit)

2. **Installer Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

3. **Déployer:**
   ```bash
   heroku login
   heroku create mon-plangenerator
   git push heroku main
   ```

4. **Configurer les variables:**
   ```bash
   heroku config:set SENDGRID_API_KEY=ta_cle
   heroku config:set FROM_EMAIL=ton@email.com
   heroku config:set MONGODB_URI=ton_uri
   ```

### Netlify (Pour frontend uniquement)

Pour héberger le frontend statiquement:

1. Connecte ton repo GitHub à Netlify
2. Build command: (vide)
3. Publish directory: `automation-platform/frontend`
4. Deploy!

## 🔧 Configuration Avancée

### Personnaliser les Templates d'Email

Les templates sont dans `backend/services/email.js`. Tu peux modifier:
- Les couleurs (inline CSS)
- Le contenu des messages
- La structure HTML

### Ajouter des Webhooks

Pour automatiser les mises à jour:

1. Utilise GitHub Actions (`.github/workflows/`)
2. Configure des cron jobs pour scraper les opportunités
3. Envoie des notifications automatiques

### Ajouter des Fonctionnalités de Scraping

⚠️ **Important:** Respecte toujours les CGU et robots.txt des sites.

Exemple avec Cheerio (déjà installé):

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeOpportunities() {
    try {
        const { data } = await axios.get('https://example.com/opportunities');
        const $ = cheerio.load(data);
        
        // Extraire les données
        const opportunities = [];
        $('.opportunity').each((i, elem) => {
            opportunities.push({
                title: $(elem).find('.title').text(),
                link: $(elem).find('a').attr('href'),
                deadline: $(elem).find('.deadline').text()
            });
        });
        
        return opportunities;
    } catch (error) {
        console.error('Scraping error:', error);
        return [];
    }
}
```

## 🎓 GitHub Student Pack

Pour obtenir des avantages gratuits:

1. Va sur [GitHub Education](https://education.github.com/pack)
2. Vérifie ton statut étudiant avec:
   - Carte étudiante
   - Email universitaire (@univ.fr)
   - Document officiel de scolarité
3. Accède à 200K$ d'outils gratuits!

### Outils inclus recommandés:
- ✅ SendGrid (100 emails/jour)
- ✅ DigitalOcean ($200 de crédit)
- ✅ Heroku (Hobby tier gratuit)
- ✅ Canva Pro (gratuit)
- ✅ JetBrains (tous les IDEs)
- ✅ .me domain (1 an gratuit)

## 🆘 Résolution des Problèmes

### Emails non reçus
- Vérifie le dossier spam/courrier indésirable
- Assure-toi que l'API key est correcte
- Vérifie que FROM_EMAIL est vérifié sur SendGrid

### Erreur de connexion MongoDB
- Vérifie que l'IP est autorisée (0.0.0.0/0)
- Assure-toi que le mot de passe ne contient pas de caractères spéciaux non encodés
- Vérifie que le nom de la base de données est correct

### Port déjà utilisé
```bash
# Trouver le processus sur le port 3000
lsof -i :3000
# Tuer le processus
kill -9 <PID>
```

## 📞 Support

- Documentation: [README.md](README.md)
- Issues GitHub: [Ouvrir une issue](https://github.com/ADLIB-Mrani/Ebook-V-001/issues)
- Guide complet: [GUIDE_COMPLET_GENERATION_REVENUS.md](../GUIDE_COMPLET_GENERATION_REVENUS.md)

## 🔐 Sécurité

⚠️ **Important:**
- Ne commit jamais le fichier `.env`
- Utilise des variables d'environnement pour les secrets
- En production, utilise bcrypt pour hasher les mots de passe
- Active HTTPS sur ton domaine
- Configure CORS correctement

## 📚 Ressources Utiles

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/guide/)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Fait avec ❤️ pour les étudiants français**
