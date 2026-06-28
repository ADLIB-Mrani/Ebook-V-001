const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const User = require('../models/User');
const { generatePlan } = require('../services/generator');
const { sendWelcomeEmail } = require('../services/email');
const { generatePlanPDF } = require('../services/pdfGenerator');
const { sanitizeUserInput, validateUserInput } = require('../utils/validators');
const { success, failure } = require('../utils/apiResponse');
const { saveUser, getUserById } = require('../services/inMemoryStore');
const path = require('path');
const fs = require('fs');

const isDbReady = () => mongoose.connection.readyState === 1 && !!User;

const pdfDownloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Trop de requêtes de téléchargement PDF. Réessaye dans 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/create', async (req, res) => {
    try {
        const userData = sanitizeUserInput(req.body || {});
        const validation = validateUserInput(userData);

        if (!validation.valid) {
            return failure(res, 'Données invalides', 400, { errors: validation.errors });
        }

        const plan = await generatePlan(userData);

        const user = {
            ...userData,
            plan,
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        if (isDbReady()) {
            const newUser = new User(user);
            await newUser.save();
        } else {
            saveUser(user);
        }

        try {
            await sendWelcomeEmail(userData.email, userData.name, plan);
        } catch (emailError) {
            console.error('Email error:', emailError.message);
        }

        return success(res, {
            userId: user.userId,
            plan,
            user
        }, 'Plan créé avec succès', 201, { demo: !isDbReady() });
    } catch (error) {
        console.error('Error creating user:', error);
        return failure(res, 'Erreur lors de la création du plan', 500);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        let user = null;

        if (isDbReady()) {
            user = await User.findOne({ userId }).lean();
        } else {
            user = getUserById(userId);
        }

        if (!user) return failure(res, 'Utilisateur introuvable', 404);

        return success(res, { user }, 'Utilisateur récupéré', 200, { demo: !isDbReady() });
    } catch (error) {
        console.error('Error fetching user:', error);
        return failure(res, 'Erreur lors de la récupération utilisateur', 500);
    }
});

router.patch('/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { taskId, completed } = req.body;

        if (!taskId || typeof completed !== 'boolean') {
            return failure(res, 'taskId ou completed invalide', 400);
        }

        if (isDbReady()) {
            const user = await User.findOne({ userId });
            if (!user) return failure(res, 'Utilisateur introuvable', 404);

            const tasks = Array.isArray(user.plan?.tasks) ? user.plan.tasks : [];
            const task = tasks.find((t) => t.id === taskId);

            if (!task) return failure(res, 'Tâche introuvable', 404);

            task.completed = completed;
            task.completedAt = completed ? new Date() : null;
            user.lastUpdated = new Date();
            await user.save();

            return success(res, {}, 'Progression mise à jour');
        }

        const localUser = getUserById(userId);
        if (!localUser) return failure(res, 'Utilisateur introuvable', 404);

        const tasks = Array.isArray(localUser.plan?.tasks) ? localUser.plan.tasks : [];
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return failure(res, 'Tâche introuvable', 404);

        task.completed = completed;
        task.completedAt = completed ? new Date() : null;
        localUser.lastUpdated = new Date();
        saveUser(localUser);

        return success(res, {}, 'Progression mise à jour (mode démo)', 200, { demo: true });
    } catch (error) {
        console.error('Error updating progress:', error);
        return failure(res, 'Erreur lors de la mise à jour', 500);
    }
});

router.post('/send-pdf-email', pdfDownloadLimiter, async (req, res) => {
    try {
        const planData = req.body;

        if (!planData || !planData.name || !planData.email) {
            return failure(res, 'Données plan/email invalides', 400);
        }

        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const safeName = planData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const fileName = `plan_${safeName}_${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);

        const normalizedPath = path.normalize(filePath);
        const normalizedTempDir = path.normalize(tempDir);
        if (!normalizedPath.startsWith(normalizedTempDir)) {
            return failure(res, 'Chemin de fichier invalide', 400);
        }

        await generatePlanPDF(planData, filePath);
        const { sendPDFEmail } = require('../services/email');
        await sendPDFEmail(planData.email, planData.name, filePath);

        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (deleteErr) {
                console.error('Error deleting temp file:', deleteErr.message);
            }
        }, 5000);

        return success(res, {}, 'PDF envoyé par email avec succès');
    } catch (error) {
        console.error('Error sending PDF email:', error);
        return failure(res, 'Erreur lors de l\'envoi PDF', 500);
    }
});

router.post('/download-pdf', pdfDownloadLimiter, async (req, res) => {
    try {
        const planData = req.body;

        if (!planData || !planData.name) {
            return failure(res, 'Données plan invalides', 400);
        }

        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const safeName = planData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const fileName = `plan_${safeName}_${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);

        const normalizedPath = path.normalize(filePath);
        const normalizedTempDir = path.normalize(tempDir);
        if (!normalizedPath.startsWith(normalizedTempDir)) {
            return failure(res, 'Chemin de fichier invalide', 400);
        }

        await generatePlanPDF(planData, filePath);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file:', err.message);
                if (!res.headersSent) failure(res, 'Erreur envoi du PDF', 500);
            }

            setTimeout(() => {
                try {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch (deleteErr) {
                    console.error('Error deleting temp file:', deleteErr.message);
                }
            }, 5000);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return failure(res, 'Erreur génération PDF', 500);
    }
});

module.exports = router;
