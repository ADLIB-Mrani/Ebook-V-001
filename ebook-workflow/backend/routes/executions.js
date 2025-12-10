const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Execution = require('../models/Execution');
const memoryStorage = require('../services/memoryStorage');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get all executions
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let executions;
    if (isMongoConnected()) {
      const query = {};
      if (status) {
        query.status = status;
      }
      executions = await Execution.find(query)
        .sort({ startTime: -1 })
        .limit(parseInt(limit))
        .select('-__v');
    } else {
      executions = memoryStorage.getAllExecutions();
      if (status) {
        executions = executions.filter(e => e.status === status);
      }
      executions = executions.slice(0, parseInt(limit));
    }
    
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single execution
router.get('/:id', async (req, res) => {
  try {
    let execution;
    if (isMongoConnected()) {
      execution = await Execution.findById(req.params.id);
    } else {
      execution = memoryStorage.getExecution(req.params.id);
    }
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    res.json(execution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get execution logs
router.get('/:id/logs', async (req, res) => {
  try {
    let execution;
    if (isMongoConnected()) {
      execution = await Execution.findById(req.params.id).select('logs');
    } else {
      execution = memoryStorage.getExecution(req.params.id);
    }
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    res.json(execution.logs || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an execution
router.delete('/:id', async (req, res) => {
  try {
    const execution = await Execution.findByIdAndDelete(req.params.id);
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    res.json({ message: 'Execution deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
