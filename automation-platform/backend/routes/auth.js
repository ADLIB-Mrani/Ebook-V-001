const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const AuthUser = require('../models/AuthUser');
const { EMAIL_REGEX, sanitizeText } = require('../utils/validators');
const { success, failure } = require('../utils/apiResponse');
const { saveAuthUser, getAuthUserByEmail } = require('../services/inMemoryStore');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Trop de tentatives, réessaye plus tard.' },
    standardHeaders: true,
    legacyHeaders: false
});

const isDbConnected = () => mongoose.connection.readyState === 1 && AuthUser;

const createToken = (user) => jwt.sign(
    { id: user.id || user._id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '12h' }
);

router.post('/signup', authLimiter, async (req, res) => {
    try {
        const name = sanitizeText(req.body.name, 100);
        const email = sanitizeText(req.body.email, 150).toLowerCase();
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (!name || !EMAIL_REGEX.test(email) || password.length < 8) {
            return failure(res, 'Données invalides (nom/email/mot de passe).', 400);
        }

        if (isDbConnected()) {
            const existing = await AuthUser.findOne({ email });
            if (existing) return failure(res, 'Un compte existe déjà avec cet email.', 409);

            const passwordHash = await bcrypt.hash(password, 12);
            const user = await AuthUser.create({ name, email, passwordHash });
            const token = createToken(user);

            return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Compte créé', 201);
        }

        if (getAuthUserByEmail(email)) {
            return failure(res, 'Un compte existe déjà avec cet email.', 409);
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const localUser = saveAuthUser({ id: `local_${Date.now()}`, name, email, passwordHash, role: 'user' });
        const token = createToken(localUser);

        return success(res, { token, user: { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role } }, 'Compte créé (mode démo)', 201, { demo: true });
    } catch (error) {
        console.error('Signup error:', error);
        return failure(res, 'Erreur interne', 500);
    }
});

router.post('/login', authLimiter, async (req, res) => {
    try {
        const email = sanitizeText(req.body.email, 150).toLowerCase();
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (!EMAIL_REGEX.test(email) || !password) {
            return failure(res, 'Email ou mot de passe invalide.', 400);
        }

        if (isDbConnected()) {
            const user = await AuthUser.findOne({ email });
            if (!user) return failure(res, 'Identifiants invalides.', 401);

            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) return failure(res, 'Identifiants invalides.', 401);

            const token = createToken(user);
            return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Connexion réussie');
        }

        const localUser = getAuthUserByEmail(email);
        if (!localUser) return failure(res, 'Identifiants invalides.', 401);

        const ok = await bcrypt.compare(password, localUser.passwordHash);
        if (!ok) return failure(res, 'Identifiants invalides.', 401);

        const token = createToken(localUser);
        return success(res, { token, user: { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role } }, 'Connexion réussie (mode démo)', 200, { demo: true });
    } catch (error) {
        console.error('Login error:', error);
        return failure(res, 'Erreur interne', 500);
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    return success(res, {
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    }, 'Session valide');
});

module.exports = router;
