const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Workflow = require('../models/Workflow');
const Execution = require('../models/Execution');
const workflowEngine = require('../services/workflowEngine');
const nodeRegistry = require('../nodes/nodeRegistry');
const memoryStorage = require('../services/memoryStorage');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get all workflows
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const workflows = await Workflow.find()
        .sort({ updatedAt: -1 })
        .select('-__v');
      res.json(workflows);
    } else {
      const workflows = memoryStorage.getAllWorkflows();
      res.json(workflows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single workflow
router.get('/:id', async (req, res) => {
  try {
    let workflow;
    if (isMongoConnected()) {
      workflow = await Workflow.findById(req.params.id);
    } else {
      workflow = memoryStorage.getWorkflow(req.params.id);
    }
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
    let workflow;
    if (isMongoConnected()) {
      workflow = new Workflow(req.body);
      await workflow.save();
    } else {
      workflow = memoryStorage.saveWorkflow(req.body);
    }
    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a workflow
router.put('/:id', async (req, res) => {
  try {
    let workflow;
    if (isMongoConnected()) {
      workflow = await Workflow.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      req.body._id = req.params.id;
      workflow = memoryStorage.saveWorkflow(req.body);
    }
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
    let success;
    if (isMongoConnected()) {
      const workflow = await Workflow.findByIdAndDelete(req.params.id);
      success = !!workflow;
    } else {
      success = memoryStorage.deleteWorkflow(req.params.id);
    }
    if (!success) {
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
    let workflow;
    if (isMongoConnected()) {
      workflow = await Workflow.findById(req.params.id);
    } else {
      workflow = memoryStorage.getWorkflow(req.params.id);
    }
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    if (workflow.status !== 'active' && workflow.status !== 'draft') {
      return res.status(400).json({ error: 'Workflow is not active' });
    }

    // Execute workflow asynchronously
    workflowEngine.execute(workflow, req.body, isMongoConnected())
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
    let executions;
    if (isMongoConnected()) {
      executions = await Execution.find({ workflowId: req.params.id })
        .sort({ startTime: -1 })
        .limit(50)
        .select('-__v');
    } else {
      executions = memoryStorage.getExecutionsByWorkflow(req.params.id);
    }
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
