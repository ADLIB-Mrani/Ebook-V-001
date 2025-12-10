const express = require('express');
const router = express.Router();
const Workflow = require('../models/Workflow');
const Execution = require('../models/Execution');
const workflowEngine = require('../services/workflowEngine');
const nodeRegistry = require('../nodes/nodeRegistry');

// Get all workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.find()
      .sort({ updatedAt: -1 })
      .select('-__v');
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single workflow
router.get('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new workflow
router.post('/', async (req, res) => {
  try {
    const workflow = new Workflow(req.body);
    await workflow.save();
    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a workflow
router.put('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a workflow
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute a workflow
router.post('/:id/execute', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    if (workflow.status !== 'active' && workflow.status !== 'draft') {
      return res.status(400).json({ error: 'Workflow is not active' });
    }

    // Execute workflow asynchronously
    workflowEngine.execute(workflow, req.body)
      .catch(error => {
        console.error('Workflow execution error:', error);
      });

    res.json({ 
      message: 'Workflow execution started',
      workflowId: workflow._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow executions
router.get('/:id/executions', async (req, res) => {
  try {
    const executions = await Execution.find({ workflowId: req.params.id })
      .sort({ startTime: -1 })
      .limit(50)
      .select('-__v');
    res.json(executions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available node types
router.get('/meta/nodes', (req, res) => {
  try {
    const nodes = nodeRegistry.getAvailableNodes();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
