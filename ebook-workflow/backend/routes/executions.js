const express = require('express');
const router = express.Router();
const Execution = require('../models/Execution');

// Get all executions
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const executions = await Execution.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single execution
router.get('/:id', async (req, res) => {
  try {
    const execution = await Execution.findById(req.params.id);
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
    const execution = await Execution.findById(req.params.id).select('logs');
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    res.json(execution.logs);
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
