/**
 * Text Generator Node
 * Generates or transforms text content
 */
class TextGeneratorNode {
  static name = 'Générateur de Texte';
  static description = 'Génère ou transforme du texte';
  static category = 'transform';
  static inputs = ['content'];
  static outputs = ['generated'];
  static config = [
    {
      name: 'mode',
      type: 'select',
      label: 'Mode',
      options: [
        { value: 'enhance', label: 'Améliorer' },
        { value: 'summarize', label: 'Résumer' },
        { value: 'expand', label: 'Développer' },
        { value: 'translate', label: 'Traduire' }
      ],
      default: 'enhance'
    },
    {
      name: 'targetLanguage',
      type: 'select',
      label: 'Langue cible',
      options: [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'Anglais' },
        { value: 'es', label: 'Espagnol' }
      ],
      showIf: { mode: 'translate' },
      default: 'fr'
    },
    {
      name: 'addIntroduction',
      type: 'checkbox',
      label: 'Ajouter une introduction',
      default: true
    },
    {
      name: 'addConclusion',
      type: 'checkbox',
      label: 'Ajouter une conclusion',
      default: true
    }
  ];

  static async execute(config, inputs, context) {
    // Get content from inputs
    const inputContent = Object.values(inputs)[0];
    if (!inputContent) {
      throw new Error('No input content provided');
    }

    const { mode, addIntroduction, addConclusion } = config;
    let sections = inputContent.sections || [];
    const title = inputContent.title || 'Ebook Sans Titre';

    // Process content based on mode
    switch (mode) {
      case 'enhance':
        sections = this.enhanceSections(sections);
        break;
      case 'summarize':
        sections = this.summarizeSections(sections);
        break;
      case 'expand':
        sections = this.expandSections(sections);
        break;
      case 'translate':
        // Simplified translation (in real app, would use translation API)
        sections = sections.map(s => ({
          ...s,
          content: `[Traduction: ${config.targetLanguage}] ${s.content}`
        }));
        break;
    }

    // Add introduction if requested
    if (addIntroduction) {
      sections.unshift({
        title: 'Introduction',
        content: this.generateIntroduction(title)
      });
    }

    // Add conclusion if requested
    if (addConclusion) {
      sections.push({
        title: 'Conclusion',
        content: this.generateConclusion(title)
      });
    }

    return {
      title,
      sections,
      metadata: {
        mode,
        processedAt: new Date().toISOString(),
        sectionCount: sections.length
      }
    };
  }

  static enhanceSections(sections) {
    return sections.map(section => ({
      ...section,
      content: this.enhanceText(section.content)
    }));
  }

  static enhanceText(text) {
    // Add formatting and improve structure
    if (!text) return text;
    
    // Ensure proper spacing
    let enhanced = text.trim();
    
    // Add bullet points for lists
    enhanced = enhanced.replace(/^- /gm, '• ');
    
    // Ensure paragraphs are separated
    enhanced = enhanced.replace(/\n{3,}/g, '\n\n');
    
    return enhanced;
  }

  static summarizeSections(sections) {
    return sections.map(section => ({
      ...section,
      content: this.summarizeText(section.content)
    }));
  }

  static summarizeText(text) {
    // Simple summarization: take first 2-3 sentences
    if (!text) return text;
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 2).join(' ').trim();
  }

  static expandSections(sections) {
    return sections.map(section => ({
      ...section,
      content: this.expandText(section.content)
    }));
  }

  static expandText(text) {
    // Add explanatory content
    if (!text) return text;
    
    return text + '\n\nCe point est particulièrement important dans le contexte actuel. ' +
           'Il convient de noter que les meilleures pratiques dans ce domaine évoluent constamment.';
  }

  static generateIntroduction(title) {
    return `Bienvenue dans ce guide : "${title}".\n\n` +
           `Ce document vous accompagnera pas à pas pour atteindre vos objectifs. ` +
           `Chaque section a été soigneusement préparée pour vous fournir des informations pratiques et actionnables.\n\n` +
           `Bonne lecture !`;
  }

  static generateConclusion(title) {
    return `Vous êtes arrivé à la fin de "${title}".\n\n` +
           `Nous espérons que ce guide vous a été utile et vous a fourni les connaissances nécessaires pour avancer dans votre projet. ` +
           `N'oubliez pas que la pratique est essentielle : mettez en application ce que vous avez appris dès aujourd'hui.\n\n` +
           `Bonne chance dans vos futurs projets !`;
  }
}

module.exports = TextGeneratorNode;
