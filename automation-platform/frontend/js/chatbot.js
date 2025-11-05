// Chatbot functionality
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const typingIndicator = document.getElementById('typingIndicator');

// Knowledge base for the chatbot
const knowledgeBase = {
    'stage': {
        keywords: ['stage', 'internship', 'stagiaire', 'entreprise', 'emploi'],
        response: `Pour trouver un stage, voici mes conseils :
        
1. **Plateformes en ligne** : LinkedIn, Indeed, Welcome to the Jungle, Choose My Company
2. **Réseaux** : Contacte tes professeurs, anciens étudiants, participe à des événements
3. **Candidatures spontanées** : Cible les entreprises qui t'intéressent
4. **Portfolio** : Montre tes projets sur GitHub ou ton site personnel
5. **Prépare-toi** : CV à jour, lettre de motivation personnalisée

💡 Astuce : Les hackathons sont excellents pour rencontrer des recruteurs !`
    },
    'bourses': {
        keywords: ['bourse', 'financement', 'aide', 'argent', 'crous'],
        response: `Voici les principales bourses et aides pour étudiants :

**Bourses nationales:**
- Bourses CROUS (sur critères sociaux)
- Aide à la mobilité Parcoursup (jusqu'à 1000€)
- Bourses au mérite (jusqu'à 900€/an)

**Entrepreneuriat:**
- PEPITE (statut étudiant-entrepreneur)
- Prêt d'honneur ADIE (jusqu'à 10 000€)
- Concours i-Lab (jusqu'à 600 000€)

**International:**
- Erasmus+ (études/stages à l'étranger)
- Bourses régionales de mobilité

🔗 Plus d'infos : etudiant.gouv.fr et pepite-france.fr`
    },
    'freelance': {
        keywords: ['freelance', 'indépendant', 'micro-entreprise', 'autoentrepreneur'],
        response: `Pour devenir freelance en France :

**1. Administratif** (15 min en ligne)
- Créer ta micro-entreprise sur autoentrepreneur.urssaf.fr
- Gratuit et simple !

**2. Plateformes pour trouver des missions:**
- Malt (France) - idéal pour débuter
- Upwork (international)
- Fiverr (services spécifiques)
- Freelancer.com

**3. Tarifs débutant:**
- Développeur web : 200-400€/jour
- Designer : 150-350€/jour
- Rédacteur : 50-150€/jour

**4. Conseils:**
- Commence avec un portfolio de 3-5 projets
- Demande des avis clients
- Spécialise-toi progressivement

💡 Tu peux cumuler avec tes études !`
    },
    'ressources': {
        keywords: ['ressources', 'apprendre', 'formation', 'cours', 'gratuit', 'outils'],
        response: `Voici les meilleures ressources gratuites :

**Programmation:**
- freeCodeCamp (complet et gratuit)
- The Odin Project (développement web)
- Codecademy (interactif)
- CS50 Harvard (sur YouTube)

**Design:**
- Canva (avec Canva Pro gratuit via GitHub Student Pack)
- Figma (gratuit pour étudiants)

**Business:**
- Google Ateliers Numériques (marketing digital)
- OpenClassrooms (nombreux cours gratuits)
- Coursera (cours d'universités, certains gratuits)

**Outils gratuits étudiants:**
- GitHub Student Pack (200K$ d'outils gratuits!)
- JetBrains (IDEs professionnels)
- Notion (organisation)
- Microsoft Office 365

🎁 Profite du GitHub Student Pack : education.github.com/pack`
    },
    'programmation': {
        keywords: ['code', 'programmation', 'développement', 'langage', 'python', 'javascript'],
        response: `Pour démarrer en programmation :

**Quel langage choisir ?**
- **Python** : IA, data science, backend (facile pour débuter)
- **JavaScript** : web frontend/backend (très demandé)
- **Java** : applications entreprises
- **Swift/Kotlin** : apps mobiles

**Parcours recommandé (6 mois):**
1. **Mois 1-2** : Bases du langage (variables, boucles, fonctions)
2. **Mois 3-4** : Projets pratiques + Git/GitHub
3. **Mois 5-6** : Framework + portfolio de 3-5 projets

**Projets débutant:**
- To-do list
- Calculatrice
- Site portfolio
- API REST simple

💻 Commence aujourd'hui sur freeCodeCamp !`
    },
    'github': {
        keywords: ['github', 'git', 'repository', 'version'],
        response: `GitHub est essentiel pour les développeurs :

**Pourquoi utiliser GitHub ?**
- Portfolio de code visible par les recruteurs
- Collaboration sur des projets
- Historique de versions
- GitHub Student Pack (outils gratuits)

**Commencer:**
1. Crée un compte sur github.com
2. Installe Git sur ton ordinateur
3. Crée ton premier repository
4. Ajoute un README.md attrayant
5. Publie tes projets régulièrement

**Profil attractif:**
- README de profil avec tes compétences
- Projets épinglés (pin tes meilleurs projets)
- Contributions régulières (commits)
- Documentation claire

🎓 GitHub Student Pack : education.github.com/pack
(Accès gratuit à des dizaines d'outils pro!)`
    },
    'business': {
        keywords: ['business', 'startup', 'entreprise', 'idée', 'lancer'],
        response: `Pour lancer ton business étudiant :

**1. Valider ton idée (Mois 1)**
- Identifie un problème réel
- Interroge 20-30 personnes de ta cible
- Analyse la concurrence
- Définis ton MVP (Minimum Viable Product)

**2. Statut étudiant-entrepreneur**
- PEPITE : statut spécial étudiant
- Garde ta bourse
- Accompagnement gratuit
- pepite-france.fr

**3. Financement:**
- Bootstrap (auto-financement)
- Concours (i-Lab, pitch contests)
- Prêts d'honneur
- Business angels

**4. Outils gratuits:**
- Canva (design)
- Notion (organisation)
- Google Workspace (si étudiant)

💡 Commence petit, teste vite, itère souvent !`
    },
    'motivation': {
        keywords: ['motivation', 'difficile', 'découragement', 'abandonner'],
        response: `Je comprends, c'est normal de douter parfois ! 💪

**Rappelle-toi pourquoi tu as commencé:**
- Tes objectifs de départ
- Ce que tu veux accomplir
- Les personnes qui croient en toi

**Conseils pratiques:**
1. Découpe ton objectif en petites étapes
2. Célèbre chaque petite victoire
3. Trouve un "accountability partner"
4. Rejoins des communautés (Discord, forums)
5. Prends des pauses quand nécessaire

**Citations inspirantes:**
"Le succès est la somme de petits efforts répétés jour après jour."
"Tu n'as pas échoué, tu as trouvé 10 000 façons qui ne fonctionnent pas."

🌟 Tu as déjà fait le plus dur : tu as commencé !`
    },
    'aide': {
        keywords: ['aide', 'help', 'besoin', 'comment'],
        response: `Je suis là pour t'aider ! 🤝

Je peux te renseigner sur :
- 📚 Ressources d'apprentissage (cours, formations)
- 💼 Recherche de stage/emploi
- 💰 Bourses et financements
- 🚀 Lancement de projet/business
- 💻 Programmation et développement
- 🎨 Outils et plateformes
- 📊 GitHub et portfolio

**Pose-moi une question spécifique** ou utilise les suggestions rapides ci-dessous !

Tu peux aussi consulter le guide complet dans le README du projet.`
    }
};

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
    
    // Auto-scroll to bottom
    scrollToBottom();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Simulate thinking time and respond
    setTimeout(() => {
        const response = getBotResponse(message);
        hideTyping();
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function askQuestion(question) {
    userInput.value = question;
    sendMessage();
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    if (sender === 'bot') {
        // Sanitize text to prevent XSS
        const sanitizedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        bubbleDiv.innerHTML = `<strong>Assistant:</strong><br>${sanitizedText.replace(/\n/g, '<br>')}`;
    } else {
        bubbleDiv.textContent = text;
    }
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    scrollToBottom();
}

function showTyping() {
    typingIndicator.style.display = 'block';
    scrollToBottom();
}

function hideTyping() {
    typingIndicator.style.display = 'none';
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/^(bonjour|salut|hello|hi|hey|coucou)/)) {
        return `Bonjour ! 👋 Comment puis-je t'aider aujourd'hui ? Tu peux me poser des questions sur :
- Trouver un stage ou un emploi
- Les bourses et financements
- Devenir freelance
- Les ressources pour apprendre
- Lancer un projet ou business`;
    }
    
    // Check for thanks
    if (lowerMessage.match(/(merci|thanks|thank you)/)) {
        return `De rien ! 😊 N'hésite pas si tu as d'autres questions. Je suis là pour t'aider à réussir !`;
    }
    
    // Check knowledge base
    for (const [key, data] of Object.entries(knowledgeBase)) {
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return data.response;
        }
    }
    
    // Default response
    return `Je ne suis pas sûr de comprendre ta question. 🤔

Voici les sujets sur lesquels je peux t'aider :
- 💼 Trouver un stage ou emploi
- 💰 Bourses et financements disponibles
- 🚀 Devenir freelance
- 📚 Ressources gratuites pour apprendre
- 💻 Programmation et développement
- 🎯 Lancer un business/startup
- 🎓 GitHub Student Pack et outils

Reformule ta question ou clique sur une suggestion rapide ci-dessous !`;
}
