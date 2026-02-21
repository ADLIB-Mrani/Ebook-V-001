const sgMail = require('@sendgrid/mail');

/**
 * Email Sender Node
 * Sends ebook via email
 */
class EmailSenderNode {
  static name = 'Envoi Email';
  static description = 'Envoie l\'ebook par email';
  static category = 'output';
  static inputs = ['file'];
  static outputs = ['status'];
  static config = [
    {
      name: 'to',
      type: 'text',
      label: 'Destinataire',
      placeholder: 'email@example.com',
      required: true
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Sujet',
      default: 'Votre ebook est prêt !',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      default: 'Bonjour,\n\nVoici votre ebook généré automatiquement.\n\nBonne lecture !',
      required: true
    }
  ];

  static async execute(config, inputs, context) {
    // Get file from inputs
    const inputFile = Object.values(inputs)[0];
    if (!inputFile || !inputFile.path) {
      throw new Error('No file provided');
    }

    const { to, subject, message } = config;
    
    if (!to) {
      throw new Error('Email recipient is required');
    }

    // Check if SendGrid is configured
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      console.warn('SendGrid not configured, skipping email send');
      return {
        sent: false,
        reason: 'SendGrid not configured',
        message: 'Set SENDGRID_API_KEY and FROM_EMAIL environment variables'
      };
    }

    try {
      sgMail.setApiKey(apiKey);

      // Read file as base64
      const fs = require('fs');
      const fileContent = fs.readFileSync(inputFile.path).toString('base64');

      const msg = {
        to,
        from: fromEmail,
        subject,
        text: message,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        attachments: [
          {
            content: fileContent,
            filename: inputFile.filename,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      await sgMail.send(msg);

      return {
        sent: true,
        to,
        subject,
        filename: inputFile.filename,
        sentAt: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = EmailSenderNode;
