const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: Number,
    education: String,
    field: String,
    planType: String,
    goal: String,
    timeline: String,
    experience: String,
    skills: String,
    timePerWeek: String,
    budget: String,
    constraints: String,
    notifications: {
        opportunities: Boolean,
        resources: Boolean,
        reminders: Boolean
    },
    frequency: String,
    interests: String,
    plan: {
        type: Object,
        default: {}
    },
    progress: {
        completedTasks: {
            type: Number,
            default: 0
        },
        totalTasks: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    opportunities: [{
        title: String,
        type: String,
        url: String,
        deadline: Date,
        addedAt: {
            type: Date,
            default: Date.now
        },
        notified: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    lastEmailSent: Date
});

// Try to create model, but don't fail if mongoose isn't connected
let User;
try {
    User = mongoose.model('User', userSchema);
} catch (error) {
    console.log('Running without database model');
    User = null;
}

module.exports = User;
