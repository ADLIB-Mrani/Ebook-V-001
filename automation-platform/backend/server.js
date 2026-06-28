const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const parseAllowedOrigins = () => {
    const raw = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000';
    return raw.split(',').map(item => item.trim()).filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS origin not allowed'));
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../frontend')));

const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected successfully');
        } else {
            console.log('MongoDB URI not configured - running in demo mode');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Running in demo mode without database');
    }
};

connectDB();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const updatesRoutes = require('./routes/updates');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');
const statsRoutes = require('./routes/stats');
const opportunitiesRoutes = require('./routes/opportunities');
const marketAnalysisRoutes = require('./routes/market-analysis');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/market-analysis', marketAnalysisRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Automation Platform API is running',
        timestamp: new Date().toISOString(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        corsOrigins: allowedOrigins
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const isProduction = process.env.NODE_ENV === 'production';

    if (err.message === 'CORS origin not allowed') {
        return res.status(403).json({ success: false, message: 'Origin not allowed' });
    }

    return res.status(500).json({
        success: false,
        message: isProduction ? 'Internal server error' : err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
