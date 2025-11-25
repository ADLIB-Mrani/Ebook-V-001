const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    interests: [{
        type: String,
        enum: ['programming', 'business', 'freelancing', 'content', 'general']
    }],
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
        default: 'weekly'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    unsubscribeToken: {
        type: String,
        unique: true,
        sparse: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    lastEmailSent: Date,
    source: {
        type: String,
        enum: ['website', 'form', 'api', 'import'],
        default: 'website'
    }
});

// Generate unsubscribe token before saving
newsletterSchema.pre('save', function(next) {
    if (!this.unsubscribeToken) {
        this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
    }
    next();
});

// Try to create model, but don't fail if mongoose isn't connected
let Newsletter;
try {
    Newsletter = mongoose.model('Newsletter', newsletterSchema);
} catch (error) {
    console.log('Running without Newsletter model');
    Newsletter = null;
}

module.exports = Newsletter;
