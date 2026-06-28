const jwt = require('jsonwebtoken');
const { failure } = require('../utils/apiResponse');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return failure(res, 'Token manquant', 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
        req.user = decoded;
        return next();
    } catch {
        return failure(res, 'Token invalide ou expiré', 401);
    }
};

const requireRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) return failure(res, 'Accès refusé', 403);
    return next();
};

module.exports = {
    authenticateToken,
    requireRole
};
