const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * PDF Generator Node
 * Generates PDF ebooks from formatted content
 */
class PdfGeneratorNode {
  static name = 'Générateur PDF';
  static description = 'Génère un ebook au format PDF';
  static category = 'output';
  static inputs = ['formatted'];
  static outputs = ['file'];
  static config = [
    {
      name: 'pageSize',
      type: 'select',
      label: 'Taille de page',
      options: [
        { value: 'A4', label: 'A4' },
        { value: 'Letter', label: 'Letter' },
        { value: 'A5', label: 'A5' }
      ],
      default: 'A4'
    },
    {
      name: 'margin',
      type: 'number',
      label: 'Marges (points)',
      default: 50,
      min: 20,
      max: 100
    },
    {
      name: 'headerColor',
      type: 'color',
      label: 'Couleur d\'en-tête',
      default: '#667eea'
    },
    {
      name: 'addCoverPage',
      type: 'checkbox',
      label: 'Page de couverture',
      default: true
    }
  ];

  static async execute(config, inputs, context) {
    // Get content from inputs
    const inputContent = Object.values(inputs)[0];
    if (!inputContent) {
      throw new Error('No input content provided');
    }

    const { pageSize, margin, headerColor, addCoverPage } = config;
    const title = inputContent.title || 'Ebook';
    const sections = inputContent.sections || [];
    const toc = inputContent.toc || [];
    const style = inputContent.style || {};

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'output', 'ebooks');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${title.replace(/[^a-z0-9]/gi, '_')}_${uuidv4().substring(0, 8)}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Create PDF
    await this.generatePDF({
      title,
      sections,
      toc,
      style,
      config: { pageSize, margin, headerColor, addCoverPage },
      outputPath
    });

    return {
      type: 'ebook',
      format: 'pdf',
      title,
      filename,
      path: outputPath,
      url: `/output/ebooks/${filename}`,
      size: fs.statSync(outputPath).size,
      createdAt: new Date().toISOString()
    };
  }

  static generatePDF(options) {
    return new Promise((resolve, reject) => {
      try {
        const { title, sections, toc, style, config, outputPath } = options;
        
        // Create document
        const doc = new PDFDocument({
          size: config.pageSize,
          margins: {
            top: config.margin,
            bottom: config.margin,
            left: config.margin,
            right: config.margin
          }
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Cover page
        if (config.addCoverPage) {
          this.addCoverPage(doc, title, config.headerColor);
          doc.addPage();
        }

        // Table of contents
        if (toc && toc.length > 0) {
          this.addTableOfContents(doc, toc);
          doc.addPage();
        }

        // Content sections
        sections.forEach((section, index) => {
          if (index > 0) {
            doc.addPage();
          }
          this.addSection(doc, section, style, config.headerColor);
        });

        // Add page numbers
        if (style.includePageNumbers) {
          this.addPageNumbers(doc);
        }

        // Finalize
        doc.end();

        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);

      } catch (error) {
        reject(error);
      }
    });
  }

  static addCoverPage(doc, title, color) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background
    doc.rect(0, 0, pageWidth, pageHeight / 3)
       .fill(color);

    // Title
    doc.fillColor('#ffffff')
       .fontSize(36)
       .font('Helvetica-Bold')
       .text(title, 0, pageHeight / 3 - 50, {
         width: pageWidth,
         align: 'center'
       });

    // Subtitle
    doc.fillColor('#000000')
       .fontSize(16)
       .font('Helvetica')
       .text('Généré par Ebook Workflow Automation', 0, pageHeight / 2, {
         width: pageWidth,
         align: 'center'
       });

    // Date
    doc.fontSize(12)
       .text(new Date().toLocaleDateString('fr-FR'), 0, pageHeight / 2 + 40, {
         width: pageWidth,
         align: 'center'
       });
  }

  static addTableOfContents(doc, toc) {
    doc.fillColor('#667eea')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('Table des Matières', { align: 'center' });

    doc.moveDown(2);

    doc.fillColor('#000000')
       .fontSize(12)
       .font('Helvetica');

    toc.forEach(item => {
      doc.text(`${item.number}. ${item.title}`, {
        indent: 20
      });
      doc.moveDown(0.5);
    });
  }

  static addSection(doc, section, style, headerColor) {
    // Section title
    doc.fillColor(headerColor || '#667eea')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text(section.title, {
         align: 'left'
       });

    doc.moveDown(1);

    // Section content
    doc.fillColor('#000000')
       .fontSize(style.fontSize || 12)
       .font(style.fontFamily || 'Helvetica')
       .text(section.content || '', {
         align: 'justify',
         lineGap: 5
       });

    doc.moveDown(2);
  }

  static addPageNumbers(doc) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      doc.fillColor('#666666')
         .fontSize(10)
         .text(
           `Page ${i + 1} sur ${pages.count}`,
           0,
           doc.page.height - 50,
           {
             width: doc.page.width,
             align: 'center'
           }
         );
    }
  }
}

module.exports = PdfGeneratorNode;
