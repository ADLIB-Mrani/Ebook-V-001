const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxlength: 254
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    category: {
        type: String,
        enum: ['general', 'support', 'feedback', 'partnership', 'bug_report'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'read', 'replied', 'archived'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    repliedAt: Date,
    ipAddress: String,
    userAgent: String
});

// Try to create model, but don't fail if mongoose isn't connected
let Contact;
try {
    Contact = mongoose.model('Contact', contactSchema);
} catch (error) {
    console.log('Running without Contact model');
    Contact = null;
}

module.exports = Contact;
