const fs = require('fs');
const path = require('path');

/**
 * Storage Node
 * Saves ebook to storage location
 */
class StorageNode {
  static name = 'Stockage';
  static description = 'Sauvegarde l\'ebook dans un emplacement';
  static category = 'output';
  static inputs = ['file'];
  static outputs = ['stored'];
  static config = [
    {
      name: 'storage',
      type: 'select',
      label: 'Type de stockage',
      options: [
        { value: 'local', label: 'Stockage local' },
        { value: 'cloud', label: 'Cloud (à venir)' }
      ],
      default: 'local'
    },
    {
      name: 'path',
      type: 'text',
      label: 'Chemin de destination',
      placeholder: 'output/ebooks',
      default: 'output/ebooks',
      showIf: { storage: 'local' }
    },
    {
      name: 'keepOriginal',
      type: 'checkbox',
      label: 'Garder l\'original',
      default: true
    }
  ];

  static async execute(config, inputs, context) {
    // Get file from inputs
    const inputFile = Object.values(inputs)[0];
    if (!inputFile || !inputFile.path) {
      throw new Error('No file provided');
    }

    const { storage, path: destPath, keepOriginal } = config;

    if (storage === 'local') {
      return this.saveLocally(inputFile, destPath, keepOriginal);
    } else {
      throw new Error('Cloud storage not yet implemented');
    }
  }

  static saveLocally(file, destPath, keepOriginal) {
    try {
      // Ensure destination directory exists
      const fullDestPath = path.join(process.cwd(), destPath || 'output/ebooks');
      if (!fs.existsSync(fullDestPath)) {
        fs.mkdirSync(fullDestPath, { recursive: true });
      }

      // File is already in the correct location if using default path
      const currentDir = path.dirname(file.path);
      const isSameLocation = path.resolve(currentDir) === path.resolve(fullDestPath);

      let finalPath = file.path;
      
      if (!isSameLocation) {
        // Copy or move file to destination
        const destFile = path.join(fullDestPath, file.filename);
        
        if (keepOriginal) {
          fs.copyFileSync(file.path, destFile);
        } else {
          fs.renameSync(file.path, destFile);
        }
        
        finalPath = destFile;
      }

      return {
        storage: 'local',
        path: finalPath,
        filename: file.filename,
        url: `/output/ebooks/${file.filename}`,
        size: fs.statSync(finalPath).size,
        storedAt: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }
}

module.exports = StorageNode;
