const mongoose = require('mongoose');

const executionLogSchema = new mongoose.Schema({
  nodeId: String,
  nodeName: String,
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'error', 'skipped'],
    default: 'pending'
  },
  startTime: Date,
  endTime: Date,
  output: mongoose.Schema.Types.Mixed,
  error: String
}, { _id: false });

const executionSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  workflowName: String,
  status: {
    type: String,
    enum: ['running', 'completed', 'failed', 'cancelled'],
    default: 'running'
  },
  triggerType: {
    type: String,
    enum: ['manual', 'schedule', 'webhook'],
    default: 'manual'
  },
  logs: [executionLogSchema],
  result: {
    ebookPath: String,
    ebookUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  error: String,
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number
}, {
  timestamps: true
});

// Calculate duration before saving
executionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = this.endTime - this.startTime;
  }
  next();
});

module.exports = mongoose.model('Execution', executionSchema);
