# 🚀 Guide de Déploiement - PlanGenerator

Ce guide complet vous aide à déployer PlanGenerator sur un serveur et à configurer toutes les fonctionnalités.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Locale](#installation-locale)
3. [Configuration](#configuration)
4. [Déploiement sur Serveur](#déploiement-sur-serveur)
5. [Fonctionnalités et Configuration](#fonctionnalités-et-configuration)
6. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 1. Prérequis

### Logiciels Requis
- **Node.js** v16 ou supérieur ([Télécharger](https://nodejs.org/))
- **npm** v8 ou supérieur (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))

### Comptes Optionnels (pour fonctionnalités complètes)
- **SendGrid** - Pour l'envoi d'emails ([S'inscrire](https://sendgrid.com/))
- **MongoDB Atlas** - Pour la base de données (optionnel) ([S'inscrire](https://www.mongodb.com/cloud/atlas))

---

## 2. Installation Locale

### Étape 1: Cloner le Dépôt

```bash
git clone https://github.com/ADLIB-Mrani/Ebook-V-001.git
cd Ebook-V-001/automation-platform
```

### Étape 2: Installer les Dépendances

```bash
# Ignorer puppeteer car non nécessaire pour la génération PDF
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

### Étape 3: Créer le Fichier de Configuration

Créez un fichier `.env` dans le dossier `automation-platform`:

```bash
touch .env
```

Ajoutez le contenu suivant (minimum pour démarrage):

```env
# Port du serveur
PORT=3000

# URL du frontend (pour les emails)
FRONTEND_URL=http://localhost:3000

# SendGrid (optionnel - laissez vide pour mode démo)
SENDGRID_API_KEY=
FROM_EMAIL=

# MongoDB (optionnel - laissez vide pour mode démo)
MONGODB_URI=
```

### Étape 4: Démarrer le Serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

**✅ Vous pouvez maintenant utiliser l'application en mode local !**

---

## 3. Configuration

### 3.1 Configuration SendGrid (Envoi d'Emails)

#### Pourquoi SendGrid ?
Pour envoyer des emails de bienvenue, notifications d'opportunités et PDFs par email.

#### Étapes:

1. **Créer un compte SendGrid gratuit**
   - Allez sur [https://sendgrid.com/](https://sendgrid.com/)
   - Cliquez sur "Start for free"
   - Plan gratuit: 100 emails/jour

2. **Obtenir une clé API**
   - Connectez-vous à SendGrid
   - Allez dans Settings > API Keys
   - Cliquez sur "Create API Key"
   - Nom: "PlanGenerator"
   - Type: "Full Access"
   - Copiez la clé (elle ne sera affichée qu'une fois)

3. **Vérifier votre email d'expéditeur**
   - Allez dans Settings > Sender Authentication
   - Cliquez sur "Verify a Single Sender"
   - Remplissez le formulaire avec votre email
   - Vérifiez l'email de confirmation

4. **Ajouter à `.env`**
   ```env
   SENDGRID_API_KEY=SG.votre_cle_api_ici
   FROM_EMAIL=votre-email@example.com
   ```

5. **Redémarrer le serveur**
   ```bash
   npm start
   ```

**✅ Les emails fonctionnent maintenant !**

### 3.2 Configuration MongoDB (Base de Données - Optionnel)

#### Pourquoi MongoDB ?
Pour sauvegarder les plans utilisateurs de manière permanente (sinon utilise localStorage).

#### Étapes:

1. **Créer un compte MongoDB Atlas**
   - Allez sur [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Cliquez sur "Try Free"
   - Choisissez le plan gratuit (M0)

2. **Créer un cluster**
   - Nom: "PlanGenerator"
   - Provider: AWS, GCP ou Azure
   - Région: la plus proche de vous
   - Cliquez sur "Create Cluster"

3. **Configurer l'accès**
   - Dans "Security > Database Access":
     - Créez un utilisateur (ex: `plangenerator`)
     - Mot de passe fort
     - Role: "Atlas admin"
   
   - Dans "Security > Network Access":
     - Cliquez sur "Add IP Address"
     - Choisissez "Allow Access from Anywhere" (0.0.0.0/0)

4. **Obtenir l'URI de connexion**
   - Cliquez sur "Connect" sur votre cluster
   - Choisissez "Connect your application"
   - Copiez l'URI
   - Remplacez `<password>` par votre mot de passe

5. **Ajouter à `.env`**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plangenerator?retryWrites=true&w=majority
   ```

6. **Redémarrer le serveur**

**✅ La base de données est maintenant active !**

---

## 4. Déploiement sur Serveur

### Option 1: Heroku (Recommandé pour débutants)

#### Prérequis
- Compte Heroku ([S'inscrire](https://signup.heroku.com/))
- Heroku CLI installé ([Instructions](https://devcenter.heroku.com/articles/heroku-cli))

#### Étapes:

1. **Se connecter à Heroku**
   ```bash
   heroku login
   ```

2. **Créer une application**
   ```bash
   cd automation-platform
   heroku create mon-plangenerator
   ```

3. **Configurer les variables d'environnement**
   ```bash
   heroku config:set SENDGRID_API_KEY=votre_cle_api
   heroku config:set FROM_EMAIL=votre@email.com
   heroku config:set MONGODB_URI=votre_uri_mongodb
   heroku config:set FRONTEND_URL=https://mon-plangenerator.herokuapp.com
   ```

4. **Déployer**
   ```bash
   git push heroku main
   ```

5. **Ouvrir l'application**
   ```bash
   heroku open
   ```

**✅ Votre application est en ligne !**

### Option 2: VPS (DigitalOcean, AWS, etc.)

#### Prérequis
- Serveur Ubuntu 20.04+ avec accès SSH
- Nom de domaine (optionnel)

#### Étapes:

1. **Se connecter au serveur**
   ```bash
   ssh root@votre-serveur-ip
   ```

2. **Installer Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Installer Git et cloner le projet**
   ```bash
   apt-get install git
   cd /var/www
   git clone https://github.com/ADLIB-Mrani/Ebook-V-001.git
   cd Ebook-V-001/automation-platform
   ```

4. **Installer les dépendances**
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm install
   ```

5. **Configurer l'environnement**
   ```bash
   nano .env
   ```
   
   Ajoutez vos configurations, puis sauvegardez (Ctrl+X, Y, Enter)

6. **Installer PM2 (gestionnaire de processus)**
   ```bash
   npm install -g pm2
   ```

7. **Démarrer l'application**
   ```bash
   pm2 start backend/server.js --name plangenerator
   pm2 save
   pm2 startup
   ```

8. **Configurer Nginx (proxy inverse)**
   ```bash
   apt-get install nginx
   nano /etc/nginx/sites-available/plangenerator
   ```
   
   Contenu:
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Activer le site**
   ```bash
   ln -s /etc/nginx/sites-available/plangenerator /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

10. **Installer SSL avec Let's Encrypt (optionnel mais recommandé)**
    ```bash
    apt-get install certbot python3-certbot-nginx
    certbot --nginx -d votre-domaine.com
    ```

**✅ Votre application est déployée sur votre serveur !**

### Option 3: Netlify + Backend séparé

Pour héberger gratuitement le frontend sur Netlify et le backend ailleurs.

1. **Frontend sur Netlify:**
   - Créez un compte sur [Netlify](https://www.netlify.com/)
   - Connectez votre dépôt GitHub
   - Dossier de build: `automation-platform/frontend`
   - Déployez

2. **Backend sur Heroku/Railway/Render:**
   - Suivez les instructions Option 1 ci-dessus
   - Mettez à jour `FRONTEND_URL` dans `.env` avec l'URL Netlify

---

## 5. Fonctionnalités et Configuration

### 5.1 ✅ Téléchargement PDF
**État:** ✅ Fonctionnel

**Utilisation:**
- Cliquez sur "Télécharger PDF" dans le dashboard
- Le PDF est généré automatiquement avec votre plan complet

**Pas d'action requise** - Fonctionne immédiatement après installation.

---

### 5.2 ✅ Envoi de PDF par Email
**État:** ✅ Fonctionnel (nécessite configuration SendGrid)

**Utilisation:**
- Cliquez sur "Envoyer par Email" dans le dashboard
- Le PDF est généré et envoyé à votre adresse email

**Action requise:**
- Configurer SendGrid (voir section 3.1)
- Sans SendGrid: mode démo (pas d'email envoyé)

---

### 5.3 ✅ Création Automatique de Tâches
**État:** ✅ Fonctionnel

**Utilisation:**
- Les tâches sont créées automatiquement quand vous générez un plan
- Basées sur votre roadmap personnalisée
- Avec dates d'échéance calculées selon votre timeline

**Fonctionnement:**
- Première visite du dashboard: tâches générées automatiquement
- ~15-20 tâches créées selon votre plan
- Sauvegardées dans localStorage
- Synchronisées avec la page "Mes Tâches"

**Pas d'action requise** - Fonctionne automatiquement !

---

### 5.4 ✅ Diagramme de Gantt
**État:** ✅ Fonctionnel

**Utilisation:**
- Allez dans Dashboard > Onglet "Diagramme de Gantt"
- Visualisez toutes vos tâches sur une timeline
- Codes couleur selon priorité
- Tâches complétées en grisé

**Fonctionnement:**
- Affiche les tâches auto-générées
- Timeline basée sur vos dates d'échéance
- Mise à jour automatique quand vous complétez des tâches

**Pas d'action requise** - Fonctionne automatiquement !

---

### 5.5 ✅ Effets Visuels Modernes (Neo)
**État:** ✅ Implémenté

**Fonctionnalités visuelles:**
- Néomorphisme (cartes avec relief 3D)
- Glassmorphism (effet verre dépoli)
- Animations fluides (floating, glow, shimmer)
- Boutons gradient
- Ombres modernes
- Effets hover améliorés

**Pages concernées:**
- ✅ Index (page d'accueil)
- ✅ Dashboard
- ✅ Tasks (tâches)
- ✅ Toutes les autres pages utilisent le CSS commun

**Pas d'action requise** - Styles appliqués automatiquement !

---

### 5.6 📧 Emails Automatiques
**État:** ✅ Fonctionnel (nécessite SendGrid)

**Types d'emails:**
1. Email de bienvenue (lors de création du plan)
2. Email avec PDF en pièce jointe
3. Notifications d'opportunités
4. Rappels de progression

**Action requise:**
- Configurer SendGrid (voir section 3.1)

---

### 5.7 💾 Sauvegarde des Données
**État:** ✅ Fonctionnel

**Modes disponibles:**

1. **localStorage (par défaut)**
   - Pas de configuration requise
   - Données sauvegardées dans le navigateur
   - Persistent tant que le cache n'est pas vidé
   - ✅ Fonctionne immédiatement

2. **MongoDB (optionnel)**
   - Configuration requise (voir section 3.2)
   - Données sauvegardées sur serveur
   - Accessibles depuis n'importe quel appareil
   - Recommandé pour production

---

## 6. Résolution de Problèmes

### Problème: "Erreur lors du téléchargement du PDF"

**Causes possibles:**
1. Dépendances npm non installées
2. Dossier temp non créé
3. Permissions d'écriture manquantes

**Solutions:**
```bash
# 1. Réinstaller les dépendances
cd automation-platform
rm -rf node_modules
PUPPETEER_SKIP_DOWNLOAD=true npm install

# 2. Créer le dossier temp manuellement
mkdir -p temp

# 3. Vérifier les permissions
chmod 755 temp

# 4. Redémarrer le serveur
npm start
```

---

### Problème: "Email non envoyé"

**Vérifications:**
1. ✅ SendGrid API key configurée dans `.env`
2. ✅ FROM_EMAIL configurée et vérifiée sur SendGrid
3. ✅ Serveur redémarré après modification `.env`

**Test:**
```bash
# Afficher les logs du serveur
npm start
# Les logs indiqueront "SendGrid not configured" si pas configuré
```

---

### Problème: "Les tâches ne s'affichent pas"

**Solutions:**
```bash
# Ouvrir la console du navigateur (F12)
# Vérifier localStorage
localStorage.getItem('userTasks')

# Réinitialiser les tâches
localStorage.removeItem('tasksAutoGenerated')
# Recharger la page
```

---

### Problème: "localhost n'autorise pas la connexion"

**Cause:** Le serveur n'est pas démarré

**Solution:**
```bash
cd automation-platform
npm start
# Attendez voir "Server running on port 3000"
```

---

### Problème: "Cannot find module"

**Solution:**
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

---

## 📊 Résumé des Fonctionnalités

| Fonctionnalité | État | Action Requise | Priorité |
|----------------|------|----------------|----------|
| Téléchargement PDF | ✅ | Aucune | - |
| Envoi PDF Email | ✅ | SendGrid | Moyenne |
| Tâches Auto | ✅ | Aucune | - |
| Gantt Chart | ✅ | Aucune | - |
| Effets Visuels | ✅ | Aucune | - |
| Email Bienvenue | ✅ | SendGrid | Moyenne |
| Base de données | ⚠️ | MongoDB (optionnel) | Faible |
| Authentification | ✅ | Aucune (localStorage) | - |
| Chatbot | ✅ | Aucune | - |

**Légende:**
- ✅ = Fonctionnel
- ⚠️ = Optionnel
- ❌ = À implémenter

---

## 🎯 Checklist de Déploiement

### Déploiement Minimum (sans email)
- [ ] Cloner le dépôt
- [ ] Installer Node.js
- [ ] Exécuter `npm install`
- [ ] Créer fichier `.env` avec PORT=3000
- [ ] Exécuter `npm start`
- [ ] Ouvrir http://localhost:3000

**✅ Toutes les fonctionnalités locales fonctionnent !**

### Déploiement Complet (avec emails)
- [ ] Tout ce qui précède
- [ ] Créer compte SendGrid
- [ ] Obtenir API key SendGrid
- [ ] Vérifier email expéditeur
- [ ] Ajouter SENDGRID_API_KEY et FROM_EMAIL dans `.env`
- [ ] Redémarrer le serveur

**✅ Toutes les fonctionnalités fonctionnent !**

### Déploiement Production (serveur en ligne)
- [ ] Tout ce qui précède
- [ ] Choisir hébergeur (Heroku/VPS/Railway)
- [ ] Déployer selon instructions ci-dessus
- [ ] Configurer nom de domaine (optionnel)
- [ ] Installer SSL (optionnel mais recommandé)
- [ ] Mettre à jour FRONTEND_URL dans `.env`

**✅ Application accessible publiquement !**

---

## 📞 Support

**Documentation supplémentaire:**
- `SETUP.md` - Configuration détaillée
- `FEATURES.md` - Liste complète des fonctionnalités
- `QUICK_START.md` - Démarrage rapide
- `README.md` - Vue d'ensemble

**Ressources externes:**
- [Node.js Documentation](https://nodejs.org/docs/)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Heroku Docs](https://devcenter.heroku.com/)

---

## 🚀 Bon Déploiement !

Vous avez maintenant toutes les informations nécessaires pour déployer PlanGenerator avec succès.

**Prochaines étapes recommandées:**
1. Tester localement d'abord
2. Configurer SendGrid pour les emails
3. Déployer sur Heroku pour un test public
4. Migrer vers VPS si besoin de plus de contrôle

**Bonne chance ! 🎉**
