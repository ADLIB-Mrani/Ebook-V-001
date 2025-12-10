const marked = require('marked');

/**
 * Formatter Node
 * Formats content for ebook generation
 */
class FormatterNode {
  static name = 'Formateur';
  static description = 'Formate le contenu pour la génération d\'ebook';
  static category = 'transform';
  static inputs = ['content'];
  static outputs = ['formatted'];
  static config = [
    {
      name: 'format',
      type: 'select',
      label: 'Format de sortie',
      options: [
        { value: 'html', label: 'HTML' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'plain', label: 'Texte brut' }
      ],
      default: 'html'
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Taille de police',
      default: 12,
      min: 8,
      max: 24
    },
    {
      name: 'fontFamily',
      type: 'select',
      label: 'Police',
      options: [
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Times-Roman', label: 'Times' },
        { value: 'Courier', label: 'Courier' }
      ],
      default: 'Helvetica'
    },
    {
      name: 'includePageNumbers',
      type: 'checkbox',
      label: 'Numéros de page',
      default: true
    },
    {
      name: 'includeTOC',
      type: 'checkbox',
      label: 'Table des matières',
      default: true
    }
  ];

  static async execute(config, inputs, context) {
    // Get content from inputs
    const inputContent = Object.values(inputs)[0];
    if (!inputContent) {
      throw new Error('No input content provided');
    }

    const { format, fontSize, fontFamily, includePageNumbers, includeTOC } = config;
    const title = inputContent.title || 'Ebook';
    const sections = inputContent.sections || [];

    // Generate table of contents
    const toc = includeTOC ? this.generateTOC(sections) : null;

    // Format sections based on output format
    let formattedSections;
    switch (format) {
      case 'html':
        formattedSections = this.formatAsHTML(sections);
        break;
      case 'markdown':
        formattedSections = this.formatAsMarkdown(sections);
        break;
      case 'plain':
        formattedSections = this.formatAsPlain(sections);
        break;
      default:
        formattedSections = sections;
    }

    return {
      title,
      sections: formattedSections,
      toc,
      style: {
        fontSize,
        fontFamily,
        includePageNumbers
      },
      metadata: {
        format,
        formattedAt: new Date().toISOString()
      }
    };
  }

  static generateTOC(sections) {
    return sections.map((section, index) => ({
      number: index + 1,
      title: section.title,
      page: index + 2 // Assuming each section starts on a new page
    }));
  }

  static formatAsHTML(sections) {
    return sections.map(section => ({
      ...section,
      content: marked.parse(section.content || '')
    }));
  }

  static formatAsMarkdown(sections) {
    return sections.map(section => ({
      ...section,
      title: `## ${section.title}`,
      content: section.content
    }));
  }

  static formatAsPlain(sections) {
    return sections.map(section => ({
      ...section,
      title: section.title.toUpperCase(),
      content: section.content
    }));
  }
}

module.exports = FormatterNode;
