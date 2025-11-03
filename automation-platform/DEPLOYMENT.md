# Guide de Déploiement

## 🚀 Déploiement Gratuit avec GitHub Student Pack

### Option 1 : Vercel (Recommandé - Le Plus Simple)

#### Avantages
- Déploiement automatique depuis GitHub
- HTTPS gratuit
- Serverless functions
- 100% gratuit pour étudiants
- Zero configuration

#### Étapes

1. **Créer compte Vercel**
   - Aller sur https://vercel.com
   - S'inscrire avec GitHub
   - Activer GitHub Student Pack

2. **Connecter le Repository**
   ```bash
   # Installer Vercel CLI
   npm i -g vercel
   
   # Se connecter
   vercel login
   
   # Déployer depuis le dossier automation-platform
   cd automation-platform
   vercel
   ```

3. **Configuration Variables d'Environnement**
   - Dans le dashboard Vercel :
     - Settings → Environment Variables
   - Ajouter :
     ```
     MONGODB_URI=your_mongodb_uri
     SENDGRID_API_KEY=your_sendgrid_key
     FROM_EMAIL=your_email
     JWT_SECRET=your_secret
     FRONTEND_URL=https://your-project.vercel.app
     ```

4. **Déploiement Automatique**
   - Chaque push sur la branche main déploie automatiquement
   - Vercel crée une preview URL pour chaque PR

#### Configuration vercel.json
Créer `vercel.json` dans automation-platform/ :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

---

### Option 2 : Netlify

#### Avantages
- Excellent pour sites statiques
- Functions serverless
- Déploiement automatique
- Gratuit illimité

#### Étapes

1. **Créer compte Netlify**
   - https://www.netlify.com
   - S'inscrire avec GitHub

2. **Déployer**
   ```bash
   # Installer CLI
   npm i -g netlify-cli
   
   # Login
   netlify login
   
   # Déployer
   netlify deploy --prod
   ```

3. **Configuration netlify.toml**
   ```toml
   [build]
     base = "automation-platform/"
     publish = "frontend/"
     command = "npm install"

   [functions]
     directory = "backend/functions/"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

---

### Option 3 : DigitalOcean App Platform

#### Avantages
- 100$ de crédits gratuits (GitHub Student Pack)
- Backend Node.js + Base de données
- Scaling automatique

#### Étapes

1. **Activer GitHub Student Pack**
   - Obtenir 100$ de crédits

2. **Créer App**
   - Dashboard DigitalOcean → Apps → Create App
   - Connecter GitHub repo
   - Sélectionner branch

3. **Configuration**
   - Type : Web Service
   - Build Command : `cd automation-platform && npm install`
   - Run Command : `node backend/server.js`
   - HTTP Port : 3000

4. **Variables d'Environnement**
   - Ajouter dans settings
   - Utiliser DigitalOcean Managed MongoDB (8$/mois mais couverts par crédits)

---

### Option 4 : Heroku (Alternative)

#### Note
Heroku a arrêté son tier gratuit, mais avec GitHub Student Pack, vous obtenez des crédits.

#### Étapes

1. **Installer Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Créer App**
   ```bash
   cd automation-platform
   heroku create your-app-name
   ```

3. **Configuration**
   ```bash
   # Variables d'environnement
   heroku config:set MONGODB_URI=your_uri
   heroku config:set SENDGRID_API_KEY=your_key
   heroku config:set JWT_SECRET=your_secret
   ```

4. **Déployer**
   ```bash
   git push heroku main
   ```

5. **Procfile**
   Créer `Procfile` :
   ```
   web: cd automation-platform && npm start
   ```

---

## 🗄️ Configuration Base de Données

### MongoDB Atlas (Recommandé)

#### Avantages
- 512MB gratuit à vie
- Facile à configurer
- Backups automatiques

#### Étapes

1. **Créer compte**
   - https://www.mongodb.com/cloud/atlas
   - Cliquer "Start Free"

2. **Créer Cluster**
   - Choisir M0 Free tier
   - Région : Europe (Paris ou Frankfurt)
   - Cluster Name : automation-platform

3. **Configurer Accès**
   - Database Access → Add Database User
   - Username : admin
   - Password : générer sécurisé
   - Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)

4. **Obtenir Connection String**
   - Clusters → Connect → Connect your application
   - Copier la string :
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/automation-platform?retryWrites=true&w=majority
     ```
   - Remplacer `<password>` par votre mot de passe

5. **Ajouter à Variables d'Environnement**
   ```bash
   MONGODB_URI=mongodb+srv://...
   ```

---

## 📧 Configuration Email (SendGrid)

### Avec GitHub Student Pack

1. **Activer SendGrid**
   - Via GitHub Student Pack
   - 100 emails/jour gratuits

2. **Créer API Key**
   - Dashboard SendGrid → Settings → API Keys
   - Create API Key
   - Full Access
   - Copier la clé (une seule fois !)

3. **Vérifier Sender**
   - Settings → Sender Authentication
   - Verify Single Sender
   - Utiliser email universitaire

4. **Configurer**
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   FROM_EMAIL=noreply@votredomaine.com
   ```

### Alternative : Mailgun

- Aussi dans GitHub Student Pack
- 5 000 emails/mois gratuits
- Configuration similaire

---

## ⚙️ Configuration GitHub Actions

### Automatisation Quotidienne des Mises à Jour

1. **Secrets GitHub**
   - Repository → Settings → Secrets → Actions
   - Ajouter :
     - `API_URL` : URL de votre API déployée
     - `API_KEY` : Token JWT pour authentification

2. **Le Workflow**
   - Déjà configuré dans `.github/workflows/update-opportunities.yml`
   - S'exécute automatiquement tous les jours à 9h UTC

3. **Tester Manuellement**
   - Actions → Update Opportunities Daily → Run workflow

---

## 🔒 Sécurité

### Variables d'Environnement à NE JAMAIS Committer

- ❌ MONGODB_URI
- ❌ SENDGRID_API_KEY
- ❌ JWT_SECRET
- ❌ Tout token ou mot de passe

### Bonnes Pratiques

1. **Utiliser .env pour développement local**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos vraies clés
   ```

2. **Ajouter .env au .gitignore** (déjà fait)

3. **Utiliser variables d'environnement en production**
   - Vercel : Dashboard → Settings → Environment Variables
   - Netlify : Site settings → Build & deploy → Environment
   - DigitalOcean : App Settings → App-Level Environment Variables

4. **Générer JWT_SECRET sécurisé**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

---

## 🧪 Tests et Validation

### Test Local

```bash
cd automation-platform
npm install
cp .env.example .env
# Éditer .env avec vos clés
npm run dev
```

Ouvrir http://localhost:3000

### Test API

```bash
# Health check
curl http://localhost:3000/api/health

# Create user (POST)
curl -X POST http://localhost:3000/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 20,
    "planType": "programming"
  }'
```

### Test Opportunités

```bash
curl http://localhost:3000/api/updates/opportunities
```

---

## 📊 Monitoring

### Vercel
- Dashboard → Your Project → Analytics
- Voir requêtes, erreurs, performance

### Logs
- Vercel : Dashboard → Deployments → View Function Logs
- Netlify : Deploys → Functions → View logs

### MongoDB Atlas
- Metrics → View performance
- Charts pour visualiser utilisation

---

## 🔄 Mises à Jour et Maintenance

### Déployer Nouvelles Fonctionnalités

```bash
# Développement local
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main

# Déploiement automatique sur Vercel/Netlify
```

### Rollback en cas de Problème

**Vercel :**
- Dashboard → Deployments → Cliquer ancienne version → Promote to Production

**Netlify :**
- Deploys → Cliquer ancienne version → Publish deploy

---

## 💰 Coûts (Avec GitHub Student Pack)

### 100% Gratuit
- ✅ Vercel : Illimité
- ✅ Netlify : Illimité
- ✅ MongoDB Atlas : 512MB (largement suffisant pour démarrer)
- ✅ SendGrid : 100 emails/jour
- ✅ GitHub Actions : 2 000 minutes/mois

### Si Croissance
- MongoDB Atlas : 9$/mois pour 2GB (optionnel)
- SendGrid : 15$/mois pour 40 000 emails (optionnel)
- DigitalOcean : Utiliser 100$ de crédits gratuits

---

## 🆘 Troubleshooting

### Problème : MongoDB ne se connecte pas
- Vérifier IP autorisées (0.0.0.0/0)
- Vérifier username/password dans URI
- Tester connexion avec MongoDB Compass

### Problème : Emails ne partent pas
- Vérifier API key SendGrid
- Vérifier sender est vérifié
- Checker logs pour erreurs spécifiques

### Problème : 502/504 Erreurs
- Vérifier logs serveur
- Vérifier variables d'environnement configurées
- Restart deployment

### Problème : GitHub Actions échoue
- Vérifier secrets configurés
- Vérifier API accessible publiquement
- Check workflow logs

---

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [SendGrid API Docs](https://docs.sendgrid.com)
- [GitHub Actions Guide](https://docs.github.com/actions)
- [GitHub Student Pack](https://education.github.com/pack)

---

## ✅ Checklist Déploiement

- [ ] Repository GitHub créé et code pushé
- [ ] MongoDB Atlas cluster créé et URI obtenue
- [ ] SendGrid API key générée et sender vérifié
- [ ] Variables d'environnement ajoutées sur plateforme déploiement
- [ ] Application déployée sur Vercel/Netlify
- [ ] Test formulaire et génération de plan
- [ ] GitHub Actions configuré avec secrets
- [ ] Test envoi email (créer test user)
- [ ] Documentation README à jour
- [ ] URL finale partagée et fonctionnelle

🎉 **Félicitations ! Votre plateforme est déployée !**
