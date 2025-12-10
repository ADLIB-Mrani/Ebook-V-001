const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Content Collector Node
 * Collects content from various sources
 */
class ContentCollectorNode {
  static name = 'Collecteur de Contenu';
  static description = 'Collecte du contenu depuis différentes sources';
  static category = 'input';
  static inputs = ['trigger'];
  static outputs = ['content'];
  static config = [
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      options: [
        { value: 'text', label: 'Texte manuel' },
        { value: 'url', label: 'URL (web scraping)' },
        { value: 'template', label: 'Template prédéfini' }
      ],
      default: 'text'
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Contenu',
      placeholder: 'Entrez votre contenu ici...',
      showIf: { source: 'text' }
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      placeholder: 'https://example.com',
      showIf: { source: 'url' }
    },
    {
      name: 'template',
      type: 'select',
      label: 'Template',
      options: [
        { value: 'business_guide', label: 'Guide Business' },
        { value: 'programming_tutorial', label: 'Tutoriel Programmation' },
        { value: 'student_resources', label: 'Ressources Étudiants' }
      ],
      showIf: { source: 'template' }
    }
  ];

  static async execute(config, inputs, context) {
    const { source } = config;

    switch (source) {
      case 'text':
        return {
          type: 'text',
          content: config.content || '',
          sections: this.parseTextSections(config.content || '')
        };

      case 'url':
        return await this.scrapeUrl(config.url);

      case 'template':
        return this.loadTemplate(config.template);

      default:
        throw new Error('Invalid source type');
    }
  }

  static parseTextSections(text) {
    // Split by headings (lines starting with # or ##)
    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;

    lines.forEach(line => {
      if (line.startsWith('##')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: line.replace(/^##\s*/, ''),
          content: ''
        };
      } else if (line.startsWith('#')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: line.replace(/^#\s*/, ''),
          content: '',
          level: 1
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });

    if (currentSection) sections.push(currentSection);
    
    return sections.length > 0 ? sections : [{ title: 'Contenu', content: text }];
  }

  static async scrapeUrl(url) {
    if (!url) {
      throw new Error('URL is required');
    }

    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Remove scripts and styles
      $('script, style').remove();
      
      // Get title
      const title = $('title').text() || $('h1').first().text() || 'Untitled';
      
      // Get main content
      const content = $('article, main, .content, #content').text() || $('body').text();
      
      return {
        type: 'scraped',
        url,
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }

  static loadTemplate(templateName) {
    const templates = {
      business_guide: {
        title: 'Guide de Création d\'Entreprise',
        sections: [
          {
            title: 'Introduction',
            content: 'Bienvenue dans ce guide complet pour lancer votre entreprise en France.'
          },
          {
            title: 'Étape 1: Validation de l\'idée',
            content: 'Avant de vous lancer, validez votre idée auprès de votre marché cible.'
          },
          {
            title: 'Étape 2: Créer sa micro-entreprise',
            content: 'La micro-entreprise est le statut le plus simple pour débuter.'
          },
          {
            title: 'Étape 3: Marketing et ventes',
            content: 'Développez votre présence en ligne et trouvez vos premiers clients.'
          },
          {
            title: 'Conclusion',
            content: 'Vous avez maintenant toutes les clés pour réussir votre projet.'
          }
        ]
      },
      programming_tutorial: {
        title: 'Apprendre la Programmation',
        sections: [
          {
            title: 'Introduction à la programmation',
            content: 'La programmation est une compétence essentielle au XXIe siècle.'
          },
          {
            title: 'Choisir son premier langage',
            content: 'Python est recommandé pour débuter grâce à sa syntaxe simple.'
          },
          {
            title: 'Les concepts fondamentaux',
            content: 'Variables, boucles, conditions et fonctions sont les bases.'
          },
          {
            title: 'Premiers projets',
            content: 'Commencez par des projets simples comme une calculatrice.'
          },
          {
            title: 'Aller plus loin',
            content: 'Explorez le développement web, mobile ou l\'intelligence artificielle.'
          }
        ]
      },
      student_resources: {
        title: 'Ressources Gratuites pour Étudiants',
        sections: [
          {
            title: 'GitHub Student Pack',
            content: 'Accédez à des dizaines d\'outils gratuits pour étudiants.'
          },
          {
            title: 'Formations en ligne',
            content: 'FreeCodeCamp, The Odin Project, et Khan Academy offrent des cours gratuits.'
          },
          {
            title: 'Bourses et aides',
            content: 'Le CROUS et les programmes PEPITE soutiennent les étudiants entrepreneurs.'
          },
          {
            title: 'Communautés',
            content: 'Rejoignez des communautés en ligne pour échanger et progresser.'
          }
        ]
      }
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error('Template not found');
    }

    return {
      type: 'template',
      template: templateName,
      ...template
    };
  }
}

module.exports = ContentCollectorNode;
