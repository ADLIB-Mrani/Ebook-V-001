const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['trigger', 'content_collector', 'text_generator', 'formatter', 'pdf_generator', 'email_sender', 'storage']
  },
  position: {
    x: Number,
    y: Number
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const connectionSchema = new mongoose.Schema({
  from: String,
  to: String
}, { _id: false });

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  nodes: [nodeSchema],
  connections: [connectionSchema],
  triggers: {
    manual: {
      type: Boolean,
      default: true
    },
    schedule: {
      enabled: Boolean,
      cron: String
    },
    webhook: {
      enabled: Boolean,
      url: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'archived'],
    default: 'draft'
  },
  lastRun: {
    type: Date
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workflow', workflowSchema);
