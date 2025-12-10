# 📚 Ebook Workflow Automation - Système N8N-like

Un système d'automatisation de workflows pour créer des ebooks, inspiré de N8N.

## 🎯 Qu'est-ce que c'est ?

Un outil d'automatisation visuel qui permet de créer des workflows (chaînes d'actions) pour générer automatiquement des ebooks au format PDF. Comme N8N, mais spécialisé dans la création d'ebooks.

## ✨ Fonctionnalités Principales

### 🔧 Éditeur de Workflow Visuel
- **Interface drag-and-drop** : Créez des workflows en glissant-déposant des nodes
- **Connexions visuelles** : Reliez les nodes pour créer des pipelines de traitement
- **Configuration intuitive** : Chaque node dispose de son propre formulaire de configuration
- **Templates prédéfinis** : Commencez rapidement avec des workflows prêts à l'emploi

### 📦 Nodes Disponibles

1. **Déclencheur (Trigger)**
   - Point de départ du workflow
   - Support pour : Manuel, Programmé, Webhook

2. **Collecteur de Contenu**
   - Source texte manuel
   - Web scraping depuis URL
   - Templates prédéfinis (Business, Programmation, Étudiants)

3. **Générateur de Texte**
   - Améliorer le contenu
   - Résumer
   - Développer
   - Traduire (simulation)
   - Ajouter introduction/conclusion

4. **Formateur**
   - Format HTML, Markdown ou texte brut
   - Configuration police et taille
   - Table des matières automatique
   - Numéros de page

5. **Générateur PDF**
   - Création de PDF professionnels
   - Page de couverture personnalisée
   - Choix de la taille de page (A4, Letter, A5)
   - Marges configurables

6. **Envoi Email**
   - Envoi automatique du PDF par email
   - Configuration des destinataires
   - Message personnalisé

7. **Stockage**
   - Sauvegarde locale
   - (Cloud à venir)

### 📊 Gestion des Workflows
- Créer, modifier, supprimer des workflows
- Activer/désactiver des workflows
- Exécution manuelle ou programmée
- Historique complet des exécutions

### 📈 Monitoring
- Logs détaillés pour chaque exécution
- Statut en temps réel
- Durée d'exécution
- Gestion des erreurs

## 🚀 Installation

### Prérequis
- Node.js 18+
- MongoDB (optionnel - fonctionne en mode démo sans)

### Installation Rapide

```bash
# 1. Aller dans le dossier
cd ebook-workflow

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
cp .env.example .env

# 4. Démarrer le serveur
npm start
```

Le serveur démarre sur `http://localhost:3001`

### Configuration (Optionnel)

Éditez le fichier `.env` :

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ebook-workflow

# Pour l'envoi d'emails (optionnel)
SENDGRID_API_KEY=votre_clé_api
FROM_EMAIL=votre@email.com
```

## 💡 Utilisation

### 1. Créer un Workflow Simple

1. Cliquez sur **"Nouveau Workflow"**
2. Glissez-déposez les nodes depuis la palette de gauche :
   - Déclencheur
   - Collecteur de Contenu
   - Générateur de Texte
   - Formateur
   - Générateur PDF
3. Cliquez sur chaque node pour le configurer
4. Enregistrez le workflow
5. Cliquez sur **"Exécuter"**

### 2. Utiliser un Template

1. Allez dans l'onglet **"Templates"**
2. Choisissez un template prédéfini
3. Cliquez sur **"Utiliser ce template"**
4. Personnalisez si nécessaire
5. Enregistrez et exécutez

### 3. Consulter les Résultats

1. Allez dans l'onglet **"Exécutions"**
2. Vous verrez l'historique de toutes les exécutions
3. Téléchargez les ebooks générés
4. Consultez les logs pour déboguer

## 🎨 Exemples de Workflows

### Workflow 1 : Ebook depuis Template

```
Trigger → Collecteur (template) → Générateur (améliorer) → Formateur → PDF
```

**Usage** : Créer rapidement un ebook depuis un template prédéfini

### Workflow 2 : Web Scraping vers Ebook

```
Trigger → Collecteur (URL) → Générateur (résumer) → Formateur → PDF → Stockage
```

**Usage** : Scraper un article de blog et le convertir en ebook

### Workflow 3 : Ebook avec Email

```
Trigger → Collecteur → Générateur → Formateur → PDF → Email
```

**Usage** : Générer et envoyer automatiquement un ebook par email

### Workflow 4 : Pipeline Complet

```
Trigger → Collecteur (texte) → Générateur (développer + intro/conclusion) → Formateur (HTML + TOC) → PDF (couverture) → Email + Stockage
```

**Usage** : Pipeline complet avec toutes les options

## 📁 Structure du Projet

```
ebook-workflow/
├── backend/
│   ├── models/           # Modèles de données (Workflow, Execution)
│   ├── routes/           # API REST
│   ├── services/         # Moteur d'exécution des workflows
│   ├── nodes/            # Implémentation des nodes
│   │   ├── TriggerNode.js
│   │   ├── ContentCollectorNode.js
│   │   ├── TextGeneratorNode.js
│   │   ├── FormatterNode.js
│   │   ├── PdfGeneratorNode.js
│   │   ├── EmailSenderNode.js
│   │   └── StorageNode.js
│   └── server.js         # Serveur Express
├── frontend/
│   ├── css/
│   │   └── styles.css    # Styles personnalisés
│   ├── js/
│   │   ├── api.js        # Client API
│   │   ├── workflow-builder.js  # Éditeur de workflow
│   │   └── app.js        # Application principale
│   └── index.html        # Interface utilisateur
├── output/               # Ebooks générés
├── workflows/            # Workflows sauvegardés
├── templates/            # Templates d'ebooks
├── package.json
└── README.md
```

## 🔧 API REST

### Workflows

- `GET /api/workflows` - Liste tous les workflows
- `GET /api/workflows/:id` - Récupère un workflow
- `POST /api/workflows` - Crée un workflow
- `PUT /api/workflows/:id` - Met à jour un workflow
- `DELETE /api/workflows/:id` - Supprime un workflow
- `POST /api/workflows/:id/execute` - Exécute un workflow
- `GET /api/workflows/meta/nodes` - Liste les nodes disponibles

### Exécutions

- `GET /api/executions` - Liste toutes les exécutions
- `GET /api/executions/:id` - Récupère une exécution
- `GET /api/executions/:id/logs` - Récupère les logs

## 🎯 Cas d'Usage

### Pour les Entrepreneurs
- Générer automatiquement des ebooks marketing
- Créer des guides produit depuis la documentation
- Produire du contenu lead magnet

### Pour les Étudiants
- Compiler des notes de cours en ebooks
- Créer des résumés de recherche
- Générer des guides d'étude

### Pour les Créateurs de Contenu
- Transformer des articles de blog en ebooks
- Compiler des threads Twitter/LinkedIn
- Créer des ressources téléchargeables

### Pour les Développeurs
- Générer de la documentation technique
- Créer des tutoriels automatiquement
- Compiler des guides d'API

## 🔐 Sécurité

- ✅ Validation des entrées
- ✅ Protection contre les injections
- ✅ Sanitization des chemins de fichiers
- ✅ Rate limiting (à venir)
- ✅ Authentification (à venir)

## 🚧 Roadmap

### Version 1.1 (À venir)
- [ ] Support EPUB en plus du PDF
- [ ] Intégration OpenAI pour génération IA
- [ ] Plus de sources de contenu (Google Docs, Notion)
- [ ] Webhooks pour déclenchement externe

### Version 1.2
- [ ] Système d'authentification
- [ ] Workflows partagés/communautaires
- [ ] Marketplace de templates
- [ ] Variables et conditions dans les workflows

### Version 2.0
- [ ] Support multi-utilisateurs
- [ ] Stockage cloud (AWS S3, Google Drive)
- [ ] Programmation avancée (cron jobs)
- [ ] Analytics et statistiques

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Proposer de nouveaux nodes
- Améliorer les templates existants
- Corriger des bugs
- Améliorer la documentation

## 📄 Licence

MIT License - Utilisation libre

## 💬 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs du serveur
3. Ouvrez une issue sur GitHub

## 🎉 Exemples de Résultats

Les ebooks générés incluent :
- Page de couverture professionnelle
- Table des matières automatique
- Mise en page soignée
- Numéros de page
- Métadonnées PDF

## 📚 Ressources Supplémentaires

- [Documentation N8N](https://docs.n8n.io/) - Inspiration
- [PDFKit](https://pdfkit.org/) - Génération PDF
- [Express.js](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Base de données

---

**Prêt à automatiser la création de vos ebooks ? Lancez le serveur et commencez maintenant ! 🚀**
