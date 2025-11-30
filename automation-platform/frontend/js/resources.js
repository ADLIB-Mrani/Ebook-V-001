// Resources Database - Comprehensive collection of resources for students
const resources = [
    // ============= PROGRAMMING =============
    // Cours Gratuits
    { name: 'freeCodeCamp', description: 'Cours interactifs complets de programmation web, data science, et plus avec certifications', category: 'programming', type: 'gratuit', icon: 'bi-code-slash', color: 'primary', url: 'https://www.freecodecamp.org/', tags: ['JavaScript', 'Python', 'Web', 'Certifications'] },
    { name: 'The Odin Project', description: 'Curriculum complet et gratuit pour devenir développeur web full-stack', category: 'programming', type: 'gratuit', icon: 'bi-laptop', color: 'info', url: 'https://www.theodinproject.com/', tags: ['HTML', 'CSS', 'JavaScript', 'Ruby', 'Node.js'] },
    { name: 'MDN Web Docs', description: 'Documentation de référence pour le développement web par Mozilla', category: 'programming', type: 'gratuit', icon: 'bi-book', color: 'success', url: 'https://developer.mozilla.org/', tags: ['Documentation', 'HTML', 'CSS', 'JavaScript'] },
    { name: 'CS50 Harvard', description: 'Meilleur cours d\'introduction à l\'informatique au monde, gratuit sur YouTube', category: 'programming', type: 'gratuit', icon: 'bi-mortarboard', color: 'danger', url: 'https://cs50.harvard.edu/', tags: ['C', 'Python', 'SQL', 'Algorithmique'] },
    { name: 'Codecademy', description: 'Plateforme interactive pour apprendre de nombreux langages', category: 'programming', type: 'freemium', icon: 'bi-terminal', color: 'warning', url: 'https://www.codecademy.com/', tags: ['Python', 'JavaScript', 'Java', 'SQL'] },
    { name: 'Exercism', description: 'Pratique de programmation avec mentorat gratuit dans 60+ langages', category: 'programming', type: 'gratuit', icon: 'bi-trophy', color: 'success', url: 'https://exercism.org/', tags: ['Pratique', 'Mentorat', '60+ langages'] },
    { name: 'Khan Academy Computing', description: 'Informatique et programmation expliqués simplement', category: 'programming', type: 'gratuit', icon: 'bi-play-circle', color: 'primary', url: 'https://www.khanacademy.org/computing', tags: ['Débutant', 'JavaScript', 'Algorithmes'] },
    { name: 'Full Stack Open', description: 'Cours complet de développement web moderne par l\'Université d\'Helsinki', category: 'programming', type: 'gratuit', icon: 'bi-layers', color: 'info', url: 'https://fullstackopen.com/', tags: ['React', 'Node.js', 'TypeScript', 'GraphQL'] },
    { name: 'Scrimba', description: 'Tutoriels interactifs avec code éditable dans la vidéo', category: 'programming', type: 'freemium', icon: 'bi-camera-video', color: 'warning', url: 'https://scrimba.com/', tags: ['React', 'JavaScript', 'CSS', 'Interactif'] },
    
    // Pratique et Challenges
    { name: 'LeetCode', description: 'Problèmes d\'algorithmes pour préparer les entretiens tech FAANG', category: 'programming', type: 'freemium', icon: 'bi-lightning', color: 'warning', url: 'https://leetcode.com/', tags: ['Algorithmes', 'Entretiens', 'FAANG'] },
    { name: 'HackerRank', description: 'Challenges de programmation et certifications reconnues', category: 'programming', type: 'gratuit', icon: 'bi-code-square', color: 'success', url: 'https://www.hackerrank.com/', tags: ['Challenges', 'Certifications', 'Recrutement'] },
    { name: 'Codewars', description: 'Katas de code pour progresser avec système de rang', category: 'programming', type: 'gratuit', icon: 'bi-trophy', color: 'danger', url: 'https://www.codewars.com/', tags: ['Katas', 'Gamification', 'Communauté'] },
    { name: 'CodePen', description: 'Playground en ligne pour HTML/CSS/JS avec communauté', category: 'programming', type: 'freemium', icon: 'bi-pencil', color: 'info', url: 'https://codepen.io/', tags: ['Frontend', 'CSS', 'Créativité'] },
    
    // ============= DATA SCIENCE & IA =============
    { name: 'Kaggle Learn', description: 'Micro-cours gratuits en data science, ML et IA avec notebooks', category: 'datascience', type: 'gratuit', icon: 'bi-bar-chart-line', color: 'info', url: 'https://www.kaggle.com/learn', tags: ['ML', 'Python', 'Data Science', 'Gratuit'] },
    { name: 'Google ML Crash Course', description: 'Introduction au Machine Learning par Google avec TensorFlow', category: 'datascience', type: 'gratuit', icon: 'bi-robot', color: 'primary', url: 'https://developers.google.com/machine-learning/crash-course', tags: ['ML', 'TensorFlow', 'Google'] },
    { name: 'Fast.ai', description: 'Deep Learning pratique et gratuit - approche top-down', category: 'datascience', type: 'gratuit', icon: 'bi-diagram-3', color: 'danger', url: 'https://www.fast.ai/', tags: ['Deep Learning', 'PyTorch', 'Pratique'] },
    { name: 'DataCamp', description: 'Cours interactifs de data science et analytics', category: 'datascience', type: 'freemium', icon: 'bi-graph-up', color: 'success', url: 'https://www.datacamp.com/', tags: ['R', 'Python', 'SQL', 'Data'] },
    { name: 'Google Colab', description: 'Notebooks Jupyter gratuits avec GPU/TPU dans le cloud', category: 'datascience', type: 'gratuit', icon: 'bi-cloud', color: 'warning', url: 'https://colab.research.google.com/', tags: ['Jupyter', 'GPU', 'Gratuit', 'Cloud'] },
    { name: 'Hugging Face', description: 'Modèles NLP et ML pré-entraînés, transformers', category: 'datascience', type: 'gratuit', icon: 'bi-emoji-smile', color: 'info', url: 'https://huggingface.co/', tags: ['NLP', 'Transformers', 'LLM', 'Open Source'] },
    { name: 'Papers With Code', description: 'Papers ML avec implémentations et benchmarks', category: 'datascience', type: 'gratuit', icon: 'bi-file-text', color: 'primary', url: 'https://paperswithcode.com/', tags: ['Research', 'SOTA', 'Papers'] },
    { name: 'StatQuest (YouTube)', description: 'Statistiques et ML expliqués simplement avec humour', category: 'datascience', type: 'gratuit', icon: 'bi-youtube', color: 'danger', url: 'https://www.youtube.com/c/joshstarmer', tags: ['Statistiques', 'ML', 'Explications'] },
    
    // ============= CYBERSECURITY =============
    { name: 'TryHackMe', description: 'Plateforme d\'apprentissage cybersec interactive avec rooms', category: 'cybersecurity', type: 'freemium', icon: 'bi-shield-lock', color: 'success', url: 'https://tryhackme.com/', tags: ['CTF', 'Pentesting', 'Débutant'] },
    { name: 'HackTheBox', description: 'Labs de pentesting et challenges pour hackers', category: 'cybersecurity', type: 'freemium', icon: 'bi-box', color: 'primary', url: 'https://www.hackthebox.com/', tags: ['Pentesting', 'Labs', 'Avancé'] },
    { name: 'Root-Me', description: 'Plateforme française de challenges de sécurité', category: 'cybersecurity', type: 'gratuit', icon: 'bi-terminal', color: 'danger', url: 'https://www.root-me.org/', tags: ['CTF', 'Français', 'Challenges'] },
    { name: 'PicoCTF', description: 'CTF éducatif par Carnegie Mellon, idéal débutants', category: 'cybersecurity', type: 'gratuit', icon: 'bi-flag', color: 'warning', url: 'https://picoctf.org/', tags: ['CTF', 'Débutant', 'Éducatif'] },
    { name: 'OverTheWire', description: 'Wargames pour apprendre Linux et sécurité', category: 'cybersecurity', type: 'gratuit', icon: 'bi-hdd-network', color: 'info', url: 'https://overthewire.org/', tags: ['Linux', 'Wargames', 'SSH'] },
    { name: 'OWASP', description: 'Ressources sécurité web, Top 10, guides et outils', category: 'cybersecurity', type: 'gratuit', icon: 'bi-shield-check', color: 'success', url: 'https://owasp.org/', tags: ['Web', 'Top 10', 'Standards'] },
    { name: 'Cybrary', description: 'Cours de cybersécurité gratuits et certifications', category: 'cybersecurity', type: 'freemium', icon: 'bi-mortarboard', color: 'primary', url: 'https://www.cybrary.it/', tags: ['Cours', 'Certifications', 'Carrière'] },
    { name: 'HackerOne', description: 'Plateforme bug bounty leader mondial', category: 'cybersecurity', type: 'gratuit', icon: 'bi-bug', color: 'danger', url: 'https://www.hackerone.com/', tags: ['Bug Bounty', 'Argent', 'Pro'] },
    
    // ============= BUSINESS & STARTUP =============
    { name: 'PEPITE', description: 'Statut national étudiant-entrepreneur avec accompagnement', category: 'business', type: 'gratuit', icon: 'bi-briefcase', color: 'primary', url: 'https://www.pepite-france.fr/', tags: ['Entrepreneuriat', 'Statut', 'France'] },
    { name: 'BPI France Création', description: 'Ressources et guides pour créer son entreprise en France', category: 'business', type: 'gratuit', icon: 'bi-building', color: 'info', url: 'https://bpifrance-creation.fr/', tags: ['Création', 'Financement', 'Guides'] },
    { name: 'Y Combinator Startup School', description: 'Formation startup gratuite par le meilleur accélérateur', category: 'business', type: 'gratuit', icon: 'bi-rocket', color: 'warning', url: 'https://www.startupschool.org/', tags: ['Startup', 'YC', 'Gratuit'] },
    { name: 'Station F', description: 'Plus grand campus de startups au monde à Paris', category: 'business', type: 'gratuit', icon: 'bi-rocket-takeoff', color: 'success', url: 'https://stationf.co/', tags: ['Startup', 'Incubateur', 'Paris'] },
    { name: 'Indie Hackers', description: 'Communauté d\'entrepreneurs solo et bootstrappers', category: 'business', type: 'gratuit', icon: 'bi-people', color: 'danger', url: 'https://www.indiehackers.com/', tags: ['Bootstrapping', 'Communauté', 'Revenus'] },
    { name: 'Product Hunt', description: 'Lancer et découvrir de nouveaux produits', category: 'business', type: 'gratuit', icon: 'bi-lightning', color: 'primary', url: 'https://www.producthunt.com/', tags: ['Lancement', 'Produits', 'Visibilité'] },
    
    // ============= E-COMMERCE =============
    { name: 'Shopify Learn', description: 'Cours e-commerce gratuits par Shopify', category: 'ecommerce', type: 'gratuit', icon: 'bi-shop', color: 'success', url: 'https://www.shopify.com/learn', tags: ['E-commerce', 'Dropshipping', 'Cours'] },
    { name: 'Google Merchant Center', description: 'Vendre sur Google Shopping gratuitement', category: 'ecommerce', type: 'gratuit', icon: 'bi-google', color: 'primary', url: 'https://www.google.com/retail/solutions/merchant-center/', tags: ['Google', 'Shopping', 'Gratuit'] },
    { name: 'WooCommerce', description: 'Plugin e-commerce WordPress gratuit et open source', category: 'ecommerce', type: 'gratuit', icon: 'bi-cart3', color: 'info', url: 'https://woocommerce.com/', tags: ['WordPress', 'Open Source', 'Gratuit'] },
    { name: 'Oberlo (resources)', description: 'Guides dropshipping et e-commerce', category: 'ecommerce', type: 'gratuit', icon: 'bi-truck', color: 'warning', url: 'https://www.shopify.com/blog/topics/dropshipping', tags: ['Dropshipping', 'Guides', 'Business'] },
    
    // ============= FREELANCING =============
    { name: 'Malt', description: 'Plateforme freelance française #1 pour tech et créatifs', category: 'freelancing', type: 'gratuit', icon: 'bi-person-badge', color: 'primary', url: 'https://www.malt.fr/', tags: ['Freelance', 'France', 'Tech'] },
    { name: 'Upwork', description: 'Plateforme freelance internationale leader', category: 'freelancing', type: 'gratuit', icon: 'bi-globe', color: 'success', url: 'https://www.upwork.com/', tags: ['International', 'Tous domaines', 'Clients'] },
    { name: 'Fiverr', description: 'Micro-services et gigs freelance', category: 'freelancing', type: 'gratuit', icon: 'bi-cash', color: 'info', url: 'https://www.fiverr.com/', tags: ['Gigs', 'Micro-services', 'Débutant'] },
    { name: 'ComeUp', description: 'Freelance français (anciennement 5euros)', category: 'freelancing', type: 'gratuit', icon: 'bi-person-workspace', color: 'warning', url: 'https://comeup.com/', tags: ['France', 'Micro-services', 'Débutant'] },
    { name: 'Toptal', description: 'Top 3% des freelances - missions premium', category: 'freelancing', type: 'gratuit', icon: 'bi-star', color: 'danger', url: 'https://www.toptal.com/', tags: ['Premium', 'Top', 'High-end'] },
    { name: 'Freebe', description: 'Facturation et gestion auto-entrepreneur', category: 'freelancing', type: 'freemium', icon: 'bi-receipt', color: 'primary', url: 'https://www.freebe.me/', tags: ['Facturation', 'Admin', 'Français'] },
    
    // ============= CRÉATION DE CONTENU =============
    { name: 'YouTube Creator Academy', description: 'Formation gratuite pour créateurs YouTube', category: 'content', type: 'gratuit', icon: 'bi-youtube', color: 'danger', url: 'https://creatoracademy.youtube.com/', tags: ['YouTube', 'Formation', 'Gratuit'] },
    { name: 'TubeBuddy', description: 'Optimisation YouTube SEO et analytics', category: 'content', type: 'freemium', icon: 'bi-graph-up', color: 'info', url: 'https://www.tubebuddy.com/', tags: ['YouTube', 'SEO', 'Analytics'] },
    { name: 'DaVinci Resolve', description: 'Montage vidéo professionnel 100% gratuit', category: 'content', type: 'gratuit', icon: 'bi-camera-reels', color: 'primary', url: 'https://www.blackmagicdesign.com/products/davinciresolve/', tags: ['Montage', 'Vidéo', 'Pro'] },
    { name: 'OBS Studio', description: 'Streaming et enregistrement open source', category: 'content', type: 'gratuit', icon: 'bi-broadcast', color: 'success', url: 'https://obsproject.com/', tags: ['Streaming', 'Enregistrement', 'Gratuit'] },
    { name: 'Canva', description: 'Design graphique accessible et miniatures', category: 'content', type: 'freemium', icon: 'bi-palette', color: 'warning', url: 'https://www.canva.com/', tags: ['Design', 'Miniatures', 'Templates'] },
    { name: 'Anchor', description: 'Podcast gratuit distribué sur Spotify', category: 'content', type: 'gratuit', icon: 'bi-mic', color: 'success', url: 'https://anchor.fm/', tags: ['Podcast', 'Spotify', 'Gratuit'] },
    { name: 'Substack', description: 'Newsletter payante avec monétisation intégrée', category: 'content', type: 'gratuit', icon: 'bi-envelope', color: 'primary', url: 'https://substack.com/', tags: ['Newsletter', 'Monétisation', 'Écriture'] },
    
    // ============= DESIGN =============
    { name: 'Figma', description: 'Outil de design UI/UX collaboratif (gratuit pour étudiants)', category: 'design', type: 'gratuit', icon: 'bi-vector-pen', color: 'primary', url: 'https://www.figma.com/', tags: ['UI/UX', 'Prototypage', 'Collaboration'] },
    { name: 'Canva Pro', description: 'Design graphique avec Pro gratuit via GitHub Student Pack', category: 'design', type: 'freemium', icon: 'bi-palette', color: 'info', url: 'https://www.canva.com/', tags: ['Design', 'Templates', 'Graphisme'] },
    { name: 'Dribbble', description: 'Communauté de designers - inspiration et portfolio', category: 'design', type: 'freemium', icon: 'bi-dribbble', color: 'danger', url: 'https://dribbble.com/', tags: ['Inspiration', 'Portfolio', 'Community'] },
    { name: 'Behance', description: 'Portfolio créatif par Adobe, gratuit', category: 'design', type: 'gratuit', icon: 'bi-grid', color: 'primary', url: 'https://www.behance.net/', tags: ['Portfolio', 'Adobe', 'Créatif'] },
    { name: 'Unsplash', description: 'Photos haute résolution gratuites et libres de droits', category: 'design', type: 'gratuit', icon: 'bi-image', color: 'success', url: 'https://unsplash.com/', tags: ['Photos', 'Libre de droits', 'HD'] },
    { name: 'unDraw', description: 'Illustrations SVG personnalisables gratuites', category: 'design', type: 'gratuit', icon: 'bi-brush', color: 'warning', url: 'https://undraw.co/', tags: ['Illustrations', 'SVG', 'Gratuit'] },
    { name: 'Coolors', description: 'Générateur de palettes de couleurs', category: 'design', type: 'gratuit', icon: 'bi-droplet-half', color: 'info', url: 'https://coolors.co/', tags: ['Couleurs', 'Palette', 'Outil'] },
    { name: 'Google Fonts', description: 'Polices web gratuites et open source', category: 'design', type: 'gratuit', icon: 'bi-fonts', color: 'primary', url: 'https://fonts.google.com/', tags: ['Fonts', 'Typographie', 'Gratuit'] },
    { name: 'Penpot', description: 'Alternative Figma open source', category: 'design', type: 'gratuit', icon: 'bi-pencil-square', color: 'danger', url: 'https://penpot.app/', tags: ['Open Source', 'UI/UX', 'Gratuit'] },
    
    // ============= MARKETING DIGITAL =============
    { name: 'Google Digital Garage', description: 'Formation marketing digital gratuite avec certification Google', category: 'marketing', type: 'gratuit', icon: 'bi-google', color: 'primary', url: 'https://learndigital.withgoogle.com/', tags: ['Marketing', 'SEO', 'Certification'] },
    { name: 'HubSpot Academy', description: 'Cours gratuits sur le marketing, les ventes et le service client', category: 'marketing', type: 'gratuit', icon: 'bi-megaphone', color: 'warning', url: 'https://academy.hubspot.com/', tags: ['Inbound', 'CRM', 'Certifications'] },
    { name: 'Google Analytics Academy', description: 'Maîtriser Google Analytics 4 gratuitement', category: 'marketing', type: 'gratuit', icon: 'bi-graph-up', color: 'info', url: 'https://analytics.google.com/analytics/academy/', tags: ['Analytics', 'GA4', 'Data'] },
    { name: 'SEMrush Academy', description: 'Cours SEO et content marketing gratuits', category: 'marketing', type: 'gratuit', icon: 'bi-search', color: 'success', url: 'https://www.semrush.com/academy/', tags: ['SEO', 'Content', 'SEM'] },
    { name: 'Ahrefs Academy', description: 'Formation SEO avancée gratuite', category: 'marketing', type: 'gratuit', icon: 'bi-bar-chart', color: 'danger', url: 'https://ahrefs.com/academy', tags: ['SEO', 'Backlinks', 'Avancé'] },
    { name: 'Mailchimp', description: 'Email marketing gratuit jusqu\'à 500 contacts', category: 'marketing', type: 'freemium', icon: 'bi-envelope', color: 'warning', url: 'https://mailchimp.com/', tags: ['Email', 'Newsletter', 'Gratuit'] },
    
    // ============= FINANCE & TRADING =============
    { name: 'Investopedia', description: 'Encyclopédie financière complète gratuite', category: 'finance', type: 'gratuit', icon: 'bi-book', color: 'primary', url: 'https://www.investopedia.com/', tags: ['Éducation', 'Finance', 'Encyclopédie'] },
    { name: 'TradingView', description: 'Charts et analyse technique gratuits', category: 'finance', type: 'freemium', icon: 'bi-graph-up-arrow', color: 'success', url: 'https://www.tradingview.com/', tags: ['Trading', 'Charts', 'Analyse'] },
    { name: 'Khan Academy Finance', description: 'Cours finance et économie gratuits', category: 'finance', type: 'gratuit', icon: 'bi-mortarboard', color: 'info', url: 'https://www.khanacademy.org/economics-finance-domain', tags: ['Cours', 'Gratuit', 'Fondamentaux'] },
    { name: 'Binance Academy', description: 'Formation crypto et blockchain gratuite', category: 'finance', type: 'gratuit', icon: 'bi-currency-bitcoin', color: 'warning', url: 'https://academy.binance.com/', tags: ['Crypto', 'Blockchain', 'Gratuit'] },
    { name: 'Finary', description: 'Suivi de patrimoine gratuit et communauté', category: 'finance', type: 'freemium', icon: 'bi-piggy-bank', color: 'danger', url: 'https://finary.com/', tags: ['Patrimoine', 'Suivi', 'France'] },
    
    // ============= ÉCRITURE & ÉDITION =============
    { name: 'Amazon KDP', description: 'Auto-publication Kindle 100% gratuite', category: 'writing', type: 'gratuit', icon: 'bi-book', color: 'warning', url: 'https://kdp.amazon.com/', tags: ['Publication', 'E-books', 'Kindle'] },
    { name: 'Gumroad', description: 'Vendre e-books et produits digitaux facilement', category: 'writing', type: 'freemium', icon: 'bi-cart', color: 'primary', url: 'https://gumroad.com/', tags: ['Vente', 'Digital', 'Créateurs'] },
    { name: 'Medium', description: 'Plateforme d\'articles avec Partner Program', category: 'writing', type: 'gratuit', icon: 'bi-pencil', color: 'success', url: 'https://medium.com/', tags: ['Articles', 'Monétisation', 'Audience'] },
    { name: 'Hemingway Editor', description: 'Améliorer la lisibilité de tes textes', category: 'writing', type: 'gratuit', icon: 'bi-pencil-square', color: 'info', url: 'https://hemingwayapp.com/', tags: ['Écriture', 'Lisibilité', 'Gratuit'] },
    { name: 'LanguageTool', description: 'Correction orthographique et grammaticale', category: 'writing', type: 'freemium', icon: 'bi-check2-circle', color: 'danger', url: 'https://languagetool.org/', tags: ['Correction', 'Français', 'Gratuit'] },
    
    // ============= FORMATION & COACHING =============
    { name: 'Udemy Instructor', description: 'Créer et vendre des cours en ligne', category: 'teaching', type: 'gratuit', icon: 'bi-mortarboard', color: 'primary', url: 'https://www.udemy.com/teaching/', tags: ['Cours', 'Vente', 'Plateforme'] },
    { name: 'Teachable', description: 'Créer sa propre école en ligne', category: 'teaching', type: 'freemium', icon: 'bi-laptop', color: 'info', url: 'https://teachable.com/', tags: ['École', 'Cours', 'Branding'] },
    { name: 'Loom', description: 'Enregistrement d\'écran facile pour tutoriels', category: 'teaching', type: 'freemium', icon: 'bi-camera-video', color: 'success', url: 'https://www.loom.com/', tags: ['Vidéo', 'Écran', 'Tutoriels'] },
    { name: 'Calendly', description: 'Planification de sessions coaching automatisée', category: 'teaching', type: 'freemium', icon: 'bi-calendar', color: 'warning', url: 'https://calendly.com/', tags: ['RDV', 'Coaching', 'Automatisation'] },
    
    // ============= OUTILS =============
    { name: 'VS Code', description: 'Éditeur de code gratuit et puissant par Microsoft', category: 'tools', type: 'gratuit', icon: 'bi-code-square', color: 'primary', url: 'https://code.visualstudio.com/', tags: ['IDE', 'Éditeur', 'Extensions'] },
    { name: 'GitHub', description: 'Plateforme de versioning et collaboration de code', category: 'tools', type: 'gratuit', icon: 'bi-github', color: 'dark', url: 'https://github.com/', tags: ['Git', 'Versioning', 'Collaboration'] },
    { name: 'GitHub Student Pack', description: '200 000$ d\'outils gratuits pour étudiants', category: 'tools', type: 'gratuit', icon: 'bi-gift', color: 'success', url: 'https://education.github.com/pack', tags: ['Étudiants', 'Gratuit', 'Outils'] },
    { name: 'JetBrains Student', description: 'IDEs professionnels gratuits pour étudiants', category: 'tools', type: 'gratuit', icon: 'bi-window', color: 'danger', url: 'https://www.jetbrains.com/student/', tags: ['IDE', 'Pro', 'Étudiants'] },
    { name: 'Notion', description: 'Outil tout-en-un pour notes, projets, et bases de données', category: 'tools', type: 'freemium', icon: 'bi-journal-text', color: 'info', url: 'https://www.notion.so/', tags: ['Organisation', 'Notes', 'Productivité'] },
    { name: 'Trello', description: 'Gestion de projets visuelle avec des tableaux Kanban', category: 'tools', type: 'freemium', icon: 'bi-kanban', color: 'primary', url: 'https://trello.com/', tags: ['Kanban', 'Projets', 'Collaboration'] },
    { name: 'Slack', description: 'Communication d\'équipe et intégrations', category: 'tools', type: 'freemium', icon: 'bi-chat', color: 'warning', url: 'https://slack.com/', tags: ['Communication', 'Équipe', 'Intégrations'] },
    { name: 'Replit', description: 'IDE en ligne pour coder depuis n\'importe où', category: 'tools', type: 'freemium', icon: 'bi-cloud', color: 'success', url: 'https://replit.com/', tags: ['Cloud', 'IDE', 'Collaboration'] },
    
    // ============= PLATEFORMES D'APPRENTISSAGE =============
    { name: 'Coursera', description: 'Cours d\'universités prestigieuses (audit gratuit)', category: 'programming', type: 'freemium', icon: 'bi-mortarboard-fill', color: 'info', url: 'https://www.coursera.org/', tags: ['MOOCs', 'Certifications', 'Universités'] },
    { name: 'edX', description: 'Cours MIT, Harvard, Berkeley... (audit gratuit)', category: 'programming', type: 'freemium', icon: 'bi-book-half', color: 'primary', url: 'https://www.edx.org/', tags: ['MOOCs', 'MIT', 'Harvard'] },
    { name: 'OpenClassrooms', description: 'Plateforme française de cours en ligne avec diplômes', category: 'programming', type: 'freemium', icon: 'bi-laptop', color: 'success', url: 'https://openclassrooms.com/', tags: ['Français', 'Diplômes', 'Tech'] },
    { name: 'LinkedIn Learning', description: 'Cours business et tech (gratuit 1 mois)', category: 'business', type: 'freemium', icon: 'bi-linkedin', color: 'primary', url: 'https://www.linkedin.com/learning/', tags: ['Business', 'Tech', 'Carrière'] }
];

let currentCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderResources();
    
    // Setup search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchResources(e.target.value);
    });
});

function filterCategory(category, event) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.btn-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    renderResources();
}

function searchResources(query) {
    const filtered = resources.filter(resource => {
        const searchText = query.toLowerCase();
        return resource.name.toLowerCase().includes(searchText) ||
               resource.description.toLowerCase().includes(searchText) ||
               resource.category.toLowerCase().includes(searchText) ||
               resource.tags.some(tag => tag.toLowerCase().includes(searchText));
    });
    
    renderResources(filtered);
}

function renderResources(customResources = null) {
    const grid = document.getElementById('resourcesGrid');
    
    let resourcesToRender = customResources || resources;
    
    // Filter by category if not 'all'
    if (currentCategory !== 'all' && !customResources) {
        resourcesToRender = resources.filter(r => r.category === currentCategory);
    }
    
    if (resourcesToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                <h5 class="mt-3 text-muted">Aucune ressource trouvée</h5>
                <p class="text-muted">Essaie avec d'autres mots-clés</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    resourcesToRender.forEach(resource => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm hover-lift">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="rounded-circle bg-${resource.color} bg-gradient text-white p-3">
                                <i class="${resource.icon} fs-4"></i>
                            </div>
                            <span class="badge bg-${resource.type === 'gratuit' ? 'success' : 'warning'}">
                                ${resource.type === 'gratuit' ? 'Gratuit' : 'Freemium'}
                            </span>
                        </div>
                        <h5 class="card-title">${resource.name}</h5>
                        <p class="card-text text-muted small">${resource.description}</p>
                        <div class="mb-3">
                            ${resource.tags.map(tag => 
                                `<span class="badge bg-light text-dark me-1 mb-1">${tag}</span>`
                            ).join('')}
                        </div>
                        <a href="${resource.url}" target="_blank" class="btn btn-outline-${resource.color} w-100">
                            <i class="bi bi-box-arrow-up-right"></i> Accéder
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}
