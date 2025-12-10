const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit workflow executions to 10 per minute
  message: 'Too many workflow executions, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve generated ebooks
app.use('/output', express.static(path.join(__dirname, '../output')));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️  MongoDB URI not configured - running in demo mode');
      console.log('   Workflows will not persist between restarts');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Running in demo mode without database');
  }
};

connectDB();

// API Routes
const workflowRoutes = require('./routes/workflows');
const executionRoutes = require('./routes/executions');

app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);

// Apply stricter rate limiting to execution endpoint
app.post('/api/workflows/:id/execute', executionLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Ebook Workflow Automation',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('\n🚀 Ebook Workflow Automation Server');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log('\n');
});

module.exports = app;
