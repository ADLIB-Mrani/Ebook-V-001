# 🚀 Guide de Démarrage Rapide

## Installation en 3 Minutes

### Étape 1 : Installation des dépendances

```bash
cd ebook-workflow
npm install
```

### Étape 2 : Configuration (optionnelle)

```bash
cp .env.example .env
```

Vous pouvez laisser le fichier `.env` par défaut. Le système fonctionnera en mode démo.

### Étape 3 : Démarrer le serveur

```bash
npm start
```

Ouvrez votre navigateur : **http://localhost:3001**

## ✅ Créer Votre Premier Ebook (2 minutes)

### Option 1 : Utiliser un Template (Le Plus Rapide)

1. Cliquez sur l'onglet **"Templates"** en haut
2. Choisissez **"Ebook Simple"**
3. Cliquez sur **"Utiliser ce template"**
4. Cliquez sur le bouton vert **"Exécuter"**
5. Allez dans l'onglet **"Exécutions"**
6. Téléchargez votre ebook PDF ! 🎉

### Option 2 : Créer un Workflow de Zéro

1. Cliquez sur **"Nouveau Workflow"**
2. Glissez ces nodes de la gauche vers le canvas (dans l'ordre) :
   - **Déclencheur**
   - **Collecteur de Contenu**
   - **Générateur de Texte**
   - **Formateur**
   - **Générateur PDF**

3. Configurez le **Collecteur de Contenu** :
   - Cliquez sur l'icône ⚙️ du node
   - Source : **Template**
   - Template : **Guide Business**
   - Cliquez **"Enregistrer"**

4. Enregistrez le workflow (bouton vert "Enregistrer")
5. Exécutez-le (bouton "Exécuter")
6. Consultez les résultats dans l'onglet "Exécutions"

## 🎨 Exemples de Workflows Prêts à l'Emploi

### 1. Ebook depuis du Texte Manuel

**Nodes** : Trigger → Collecteur (texte) → Générateur → Formateur → PDF

**Configuration** :
- Collecteur : Entrez votre texte directement
- Générateur : Mode "Améliorer" + Ajouter intro/conclusion
- Formateur : Format HTML + Table des matières
- PDF : A4 + Page de couverture

### 2. Scraper un Site Web en Ebook

**Nodes** : Trigger → Collecteur (URL) → Générateur (résumer) → Formateur → PDF

**Configuration** :
- Collecteur : URL du site à scraper
- Générateur : Mode "Résumer"
- PDF : Format A4

### 3. Ebook Automatique avec Email

**Nodes** : Trigger → Collecteur → Générateur → Formateur → PDF → Email

**Configuration** :
- Ajoutez votre email dans le node "Email Sender"
- Configurez SendGrid dans `.env` (voir ci-dessous)

## 📧 Configuration Email (Optionnel)

Pour envoyer des ebooks par email :

1. Créez un compte gratuit sur [SendGrid](https://sendgrid.com)
2. Obtenez une clé API
3. Éditez le fichier `.env` :
   ```env
   SENDGRID_API_KEY=SG.votre_clé_ici
   FROM_EMAIL=votre@email.com
   ```
4. Redémarrez le serveur : `npm start`

## 🗄️ Configuration MongoDB (Optionnel)

Par défaut, le système fonctionne sans base de données (mode démo).

Pour sauvegarder vos workflows de façon permanente :

1. Installez MongoDB localement ou utilisez [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuit)
2. Éditez `.env` :
   ```env
   MONGODB_URI=mongodb://localhost:27017/ebook-workflow
   ```
3. Redémarrez le serveur

## ❓ FAQ

### Le serveur ne démarre pas ?

```bash
# Vérifier que Node.js est installé
node --version  # Doit afficher v18 ou supérieur

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### "Cannot find module" ?

```bash
npm install
```

### Les ebooks ne se génèrent pas ?

1. Vérifiez les logs du serveur dans le terminal
2. Consultez l'onglet "Exécutions" pour voir les erreurs
3. Assurez-vous que le dossier `output/ebooks` existe

### Où sont les ebooks générés ?

```
ebook-workflow/output/ebooks/
```

Ou téléchargez-les depuis l'onglet "Exécutions"

## 🎯 Prochaines Étapes

1. **Explorez les templates** - Modifiez-les pour vos besoins
2. **Créez vos propres workflows** - Expérimentez avec différents nodes
3. **Configurez les options avancées** - Personnalisez polices, couleurs, marges
4. **Automatisez** - Programmez des exécutions récurrentes (à venir)

## 🆘 Besoin d'Aide ?

- Consultez le `README.md` complet
- Vérifiez les logs du serveur
- Les ebooks d'exemple sont dans `output/ebooks/`

## 🚀 Démarrez Maintenant !

```bash
cd ebook-workflow
npm install
npm start
# Ouvrez http://localhost:3001
```

Bon workflow ! 📚✨
