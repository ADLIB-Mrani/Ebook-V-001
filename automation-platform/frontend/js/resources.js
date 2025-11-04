// Resources Database
const resources = [
    // Programming
    {
        name: 'freeCodeCamp',
        description: 'Cours interactifs complets de programmation web, data science, et plus',
        category: 'programming',
        type: 'gratuit',
        icon: 'bi-code-slash',
        color: 'primary',
        url: 'https://www.freecodecamp.org/',
        tags: ['JavaScript', 'Python', 'Web', 'Certifications']
    },
    {
        name: 'The Odin Project',
        description: 'Curriculum complet et gratuit pour devenir développeur web full-stack',
        category: 'programming',
        type: 'gratuit',
        icon: 'bi-laptop',
        color: 'info',
        url: 'https://www.theodinproject.com/',
        tags: ['HTML', 'CSS', 'JavaScript', 'Ruby', 'Node.js']
    },
    {
        name: 'MDN Web Docs',
        description: 'Documentation de référence pour le développement web par Mozilla',
        category: 'programming',
        type: 'gratuit',
        icon: 'bi-book',
        color: 'success',
        url: 'https://developer.mozilla.org/',
        tags: ['Documentation', 'HTML', 'CSS', 'JavaScript']
    },
    {
        name: 'CS50 Harvard',
        description: 'Introduction à l\'informatique par l\'université Harvard (sur YouTube)',
        category: 'programming',
        type: 'gratuit',
        icon: 'bi-mortarboard',
        color: 'danger',
        url: 'https://cs50.harvard.edu/',
        tags: ['C', 'Python', 'SQL', 'Algorithmique']
    },
    {
        name: 'Codecademy',
        description: 'Plateforme interactive pour apprendre de nombreux langages',
        category: 'programming',
        type: 'freemium',
        icon: 'bi-terminal',
        color: 'warning',
        url: 'https://www.codecademy.com/',
        tags: ['Python', 'JavaScript', 'Java', 'SQL']
    },
    {
        name: 'Exercism',
        description: 'Pratique de programmation avec mentorat gratuit',
        category: 'programming',
        type: 'gratuit',
        icon: 'bi-trophy',
        color: 'success',
        url: 'https://exercism.org/',
        tags: ['Pratique', 'Mentorat', '60+ langages']
    },
    
    // Business
    {
        name: 'PEPITE',
        description: 'Statut national étudiant-entrepreneur avec accompagnement',
        category: 'business',
        type: 'gratuit',
        icon: 'bi-briefcase',
        color: 'primary',
        url: 'https://www.pepite-france.fr/',
        tags: ['Entrepreneuriat', 'Statut', 'Accompagnement']
    },
    {
        name: 'BPI France Création',
        description: 'Ressources et guides pour créer son entreprise en France',
        category: 'business',
        type: 'gratuit',
        icon: 'bi-building',
        color: 'info',
        url: 'https://bpifrance-creation.fr/',
        tags: ['Création', 'Financement', 'Guides']
    },
    {
        name: 'Google Ateliers Numériques',
        description: 'Formation gratuite en marketing digital certifiée par Google',
        category: 'business',
        type: 'gratuit',
        icon: 'bi-graph-up',
        color: 'danger',
        url: 'https://learndigital.withgoogle.com/',
        tags: ['Marketing', 'SEO', 'Analytics', 'Certification']
    },
    {
        name: 'HubSpot Academy',
        description: 'Cours gratuits sur le marketing, les ventes et le service client',
        category: 'business',
        type: 'gratuit',
        icon: 'bi-megaphone',
        color: 'warning',
        url: 'https://academy.hubspot.com/',
        tags: ['Marketing', 'Inbound', 'CRM', 'Sales']
    },
    {
        name: 'Station F',
        description: 'Plus grand campus de startups au monde, basé à Paris',
        category: 'business',
        type: 'gratuit',
        icon: 'bi-rocket-takeoff',
        color: 'success',
        url: 'https://stationf.co/',
        tags: ['Startup', 'Incubateur', 'Networking']
    },
    
    // Design
    {
        name: 'Canva',
        description: 'Outil de design graphique avec Canva Pro gratuit (GitHub Student Pack)',
        category: 'design',
        type: 'freemium',
        icon: 'bi-palette',
        color: 'info',
        url: 'https://www.canva.com/',
        tags: ['Design', 'Templates', 'Graphisme']
    },
    {
        name: 'Figma',
        description: 'Outil de design d\'interface collaboratif (gratuit pour étudiants)',
        category: 'design',
        type: 'gratuit',
        icon: 'bi-vector-pen',
        color: 'primary',
        url: 'https://www.figma.com/',
        tags: ['UI/UX', 'Prototypage', 'Collaboration']
    },
    {
        name: 'Dribbble',
        description: 'Communauté de designers - inspiration et portfolio',
        category: 'design',
        type: 'freemium',
        icon: 'bi-dribbble',
        color: 'danger',
        url: 'https://dribbble.com/',
        tags: ['Inspiration', 'Portfolio', 'Community']
    },
    {
        name: 'Unsplash',
        description: 'Photos haute résolution gratuites et libres de droits',
        category: 'design',
        type: 'gratuit',
        icon: 'bi-image',
        color: 'success',
        url: 'https://unsplash.com/',
        tags: ['Photos', 'Libre de droits', 'HD']
    },
    {
        name: 'Font Awesome',
        description: 'Bibliothèque d\'icônes et de fonts pour le web',
        category: 'design',
        type: 'freemium',
        icon: 'bi-fonts',
        color: 'warning',
        url: 'https://fontawesome.com/',
        tags: ['Icônes', 'Fonts', 'Web']
    },
    
    // Tools
    {
        name: 'VS Code',
        description: 'Éditeur de code gratuit et puissant par Microsoft',
        category: 'tools',
        type: 'gratuit',
        icon: 'bi-code-square',
        color: 'primary',
        url: 'https://code.visualstudio.com/',
        tags: ['IDE', 'Éditeur', 'Extensions']
    },
    {
        name: 'GitHub',
        description: 'Plateforme de versioning et collaboration de code',
        category: 'tools',
        type: 'gratuit',
        icon: 'bi-github',
        color: 'dark',
        url: 'https://github.com/',
        tags: ['Git', 'Versioning', 'Collaboration']
    },
    {
        name: 'Notion',
        description: 'Outil tout-en-un pour notes, projets, et bases de données',
        category: 'tools',
        type: 'freemium',
        icon: 'bi-journal-text',
        color: 'info',
        url: 'https://www.notion.so/',
        tags: ['Organisation', 'Notes', 'Productivité']
    },
    {
        name: 'Trello',
        description: 'Gestion de projets visuelle avec des tableaux Kanban',
        category: 'tools',
        type: 'freemium',
        icon: 'bi-kanban',
        color: 'primary',
        url: 'https://trello.com/',
        tags: ['Kanban', 'Projets', 'Collaboration']
    },
    {
        name: 'Postman',
        description: 'Plateforme pour tester et développer des APIs',
        category: 'tools',
        type: 'freemium',
        icon: 'bi-send',
        color: 'warning',
        url: 'https://www.postman.com/',
        tags: ['API', 'Testing', 'Développement']
    },
    {
        name: 'JetBrains',
        description: 'Suite d\'IDEs professionnels (gratuit pour étudiants)',
        category: 'tools',
        type: 'gratuit',
        icon: 'bi-window',
        color: 'danger',
        url: 'https://www.jetbrains.com/student/',
        tags: ['IDE', 'PyCharm', 'IntelliJ', 'WebStorm']
    },
    
    // Learning Platforms
    {
        name: 'Coursera',
        description: 'Cours en ligne d\'universités prestigieuses (certains gratuits)',
        category: 'programming',
        type: 'freemium',
        icon: 'bi-mortarboard-fill',
        color: 'info',
        url: 'https://www.coursera.org/',
        tags: ['MOOCs', 'Certifications', 'Universités']
    },
    {
        name: 'edX',
        description: 'Cours universitaires en ligne (MIT, Harvard, Berkeley...)',
        category: 'programming',
        type: 'freemium',
        icon: 'bi-book-half',
        color: 'primary',
        url: 'https://www.edx.org/',
        tags: ['MOOCs', 'MIT', 'Harvard']
    },
    {
        name: 'OpenClassrooms',
        description: 'Plateforme française de cours en ligne avec certifications',
        category: 'programming',
        type: 'freemium',
        icon: 'bi-laptop',
        color: 'success',
        url: 'https://openclassrooms.com/',
        tags: ['Français', 'Diplômes', 'Tech']
    }
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
