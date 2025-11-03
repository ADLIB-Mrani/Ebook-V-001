const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendWelcomeEmail = async (email, name, plan) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid not configured - email would be sent to:', email);
        return { success: true, demo: true };
    }
    
    const msg = {
        to: email,
        from: process.env.FROM_EMAIL || 'noreply@plangenerator.com',
        subject: `Bienvenue ${name} ! Ton plan personnalisé est prêt 🚀`,
        html: generateWelcomeEmailHTML(name, plan)
    };
    
    try {
        await sgMail.send(msg);
        console.log(`Welcome email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendOpportunityEmail = async (email, name, opportunities) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid not configured - opportunity email would be sent to:', email);
        return { success: true, demo: true };
    }
    
    const msg = {
        to: email,
        from: process.env.FROM_EMAIL || 'noreply@plangenerator.com',
        subject: `${name}, ${opportunities.length} nouvelles opportunités pour toi ! 🎯`,
        html: generateOpportunityEmailHTML(name, opportunities)
    };
    
    try {
        await sgMail.send(msg);
        console.log(`Opportunity email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendProgressReminder = async (email, name, nextMilestone) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid not configured - reminder email would be sent to:', email);
        return { success: true, demo: true };
    }
    
    const msg = {
        to: email,
        from: process.env.FROM_EMAIL || 'noreply@plangenerator.com',
        subject: `${name}, continue ton parcours ! 💪`,
        html: generateReminderEmailHTML(name, nextMilestone)
    };
    
    try {
        await sgMail.send(msg);
        console.log(`Reminder email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// HTML Email Templates
const generateWelcomeEmailHTML = (name, plan) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .phase { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 5px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Bienvenue ${name} !</h1>
            <p>Ton plan personnalisé est prêt</p>
        </div>
        <div class="content">
            <h2>${plan.title}</h2>
            <p><strong>Durée:</strong> ${plan.adjustedDuration || plan.duration}</p>
            <p><strong>Objectif:</strong> ${plan.personalInfo?.goal || plan.description}</p>
            
            <h3>📋 Tes Prochaines Étapes:</h3>
            ${plan.phases?.slice(0, 2).map(phase => `
                <div class="phase">
                    <h4>${phase.name}</h4>
                    <ul>
                        ${phase.tasks.slice(0, 3).map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            `).join('') || ''}
            
            <p>Tu recevras des mises à jour régulières sur :</p>
            <ul>
                <li>✅ Nouvelles opportunités (bourses, hackathons, emplois)</li>
                <li>📚 Ressources d'apprentissage</li>
                <li>🎯 Rappels de jalons importants</li>
            </ul>
            
            <center>
                <a href="${process.env.FRONTEND_URL}/dashboard.html?id=${plan.userId}" class="button">
                    Voir mon plan complet
                </a>
            </center>
            
            <p><strong>Conseil de démarrage:</strong> Commence par la première tâche dès aujourd'hui, même 15 minutes suffisent pour créer l'élan !</p>
        </div>
        <div class="footer">
            <p>Tu peux te désinscrire à tout moment en cliquant sur le lien dans nos emails</p>
            <p>PlanGenerator - Automatisation de plans personnalisés pour étudiants</p>
        </div>
    </div>
</body>
</html>
    `;
};

const generateOpportunityEmailHTML = (name, opportunities) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0dcaf0; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .opportunity { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0dcaf0; border-radius: 5px; }
        .badge { display: inline-block; background: #0dcaf0; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px; }
        .button { display: inline-block; background: #0dcaf0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Nouvelles Opportunités !</h1>
            <p>Bonjour ${name}</p>
        </div>
        <div class="content">
            <p>Nous avons trouvé <strong>${opportunities.length} nouvelles opportunités</strong> qui correspondent à ton profil :</p>
            
            ${opportunities.map(opp => `
                <div class="opportunity">
                    <span class="badge">${opp.type}</span>
                    <h4>${opp.title}</h4>
                    <p>${opp.description || ''}</p>
                    ${opp.deadline ? `<p><strong>⏰ Deadline:</strong> ${new Date(opp.deadline).toLocaleDateString('fr-FR')}</p>` : ''}
                    <a href="${opp.url}" class="button">En savoir plus</a>
                </div>
            `).join('')}
            
            <p><strong>💡 Conseil:</strong> Postule rapidement aux opportunités qui t'intéressent. Les meilleures places partent vite !</p>
        </div>
    </div>
</body>
</html>
    `;
};

const generateReminderEmailHTML = (name, nextMilestone) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #198754; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #198754; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💪 Continue ton parcours !</h1>
            <p>Salut ${name}</p>
        </div>
        <div class="content">
            <p>Tu progresses bien ! Voici ton prochain jalon :</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #198754; border-radius: 5px; margin: 20px 0;">
                <h3>${nextMilestone?.name || 'Prochaine étape'}</h3>
                <p>${nextMilestone?.description || 'Continue sur ta lancée !'}</p>
                ${nextMilestone?.targetDate ? `<p><strong>Objectif:</strong> ${new Date(nextMilestone.targetDate).toLocaleDateString('fr-FR')}</p>` : ''}
            </div>
            
            <p><strong>🎯 Motivation du jour:</strong> "Le succès est la somme de petits efforts répétés jour après jour."</p>
            
            <center>
                <a href="${process.env.FRONTEND_URL}/dashboard.html" class="button">
                    Voir ma progression
                </a>
            </center>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = {
    sendWelcomeEmail,
    sendOpportunityEmail,
    sendProgressReminder
};
