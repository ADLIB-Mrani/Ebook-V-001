const Execution = require('../models/Execution');
const nodeRegistry = require('../nodes/nodeRegistry');
const memoryStorage = require('./memoryStorage');

/**
 * Workflow execution engine
 * Executes workflows in topological order following connections
 */
class WorkflowEngine {
  constructor() {
    this.activeExecutions = new Map();
  }

  /**
   * Execute a workflow
   * @param {Object} workflow - The workflow to execute
   * @param {Object} triggerData - Data from the trigger
   * @param {Boolean} useMongoose - Whether to use Mongoose or memory storage
   * @returns {Promise<Object>} Execution result
   */
  async execute(workflow, triggerData = {}, useMongoose = true) {
    // Create execution record
    const executionData = {
      workflowId: workflow._id,
      workflowName: workflow.name,
      triggerType: triggerData.type || 'manual',
      status: 'running',
      logs: []
    };

    let execution;
    if (useMongoose) {
      execution = new Execution(executionData);
      await execution.save();
    } else {
      execution = memoryStorage.saveExecution(executionData);
    }
    
    this.activeExecutions.set(execution._id.toString(), execution);

    try {
      // Build execution order
      const executionOrder = this.buildExecutionOrder(workflow.nodes, workflow.connections);
      
      // Execute nodes in order
      const context = {
        workflowId: workflow._id,
        executionId: execution._id,
        triggerData,
        outputs: {}
      };

      for (const nodeId of executionOrder) {
        const node = workflow.nodes.find(n => n.id === nodeId);
        if (!node) continue;

        const log = {
          nodeId: node.id,
          nodeName: node.type,
          status: 'running',
          startTime: new Date()
        };

        try {
          // Get node executor
          const nodeExecutor = nodeRegistry.getNode(node.type);
          if (!nodeExecutor) {
            throw new Error(`Node type '${node.type}' not found`);
          }

          // Get inputs from connected nodes
          const inputs = this.getNodeInputs(node.id, workflow.connections, context.outputs);
          
          // Execute node
          const output = await nodeExecutor.execute(node.config, inputs, context);
          
          // Store output
          context.outputs[node.id] = output;
          
          log.status = 'success';
          log.endTime = new Date();
          log.output = output;
        } catch (error) {
          log.status = 'error';
          log.endTime = new Date();
          log.error = error.message;
          
          execution.logs.push(log);
          throw error;
        }

        execution.logs.push(log);
        if (useMongoose) {
          await execution.save();
        } else {
          memoryStorage.saveExecution(execution);
        }
      }

      // Get final output (from last node or pdf_generator node)
      const finalOutput = this.getFinalOutput(workflow.nodes, context.outputs);
      
      execution.status = 'completed';
      execution.endTime = new Date();
      execution.result = finalOutput;
      if (useMongoose) {
        await execution.save();
      } else {
        memoryStorage.saveExecution(execution);
      }

      this.activeExecutions.delete(execution._id.toString());
      
      return {
        success: true,
        executionId: execution._id,
        result: finalOutput
      };

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error.message;
      if (useMongoose) {
        await execution.save();
      } else {
        memoryStorage.saveExecution(execution);
      }

      this.activeExecutions.delete(execution._id.toString());
      
      throw error;
    }
  }

  /**
   * Build execution order using topological sort
   */
  buildExecutionOrder(nodes, connections) {
    const nodeIds = nodes.map(n => n.id);
    const graph = new Map();
    const inDegree = new Map();

    // Initialize
    nodeIds.forEach(id => {
      graph.set(id, []);
      inDegree.set(id, 0);
    });

    // Build graph
    connections.forEach(conn => {
      if (graph.has(conn.from) && inDegree.has(conn.to)) {
        graph.get(conn.from).push(conn.to);
        inDegree.set(conn.to, inDegree.get(conn.to) + 1);
      }
    });

    // Topological sort
    const queue = [];
    const order = [];

    // Find nodes with no incoming edges (start nodes)
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift();
      order.push(nodeId);

      const neighbors = graph.get(nodeId) || [];
      neighbors.forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    // Check for cycles
    if (order.length !== nodeIds.length) {
      throw new Error('Workflow contains cycles');
    }

    return order;
  }

  /**
   * Get inputs for a node from connected nodes
   */
  getNodeInputs(nodeId, connections, outputs) {
    const inputs = {};
    
    connections.forEach(conn => {
      if (conn.to === nodeId && outputs[conn.from]) {
        inputs[conn.from] = outputs[conn.from];
      }
    });

    return inputs;
  }

  /**
   * Get final output from workflow execution
   */
  getFinalOutput(nodes, outputs) {
    // Priority: pdf_generator node > last node
    const pdfNode = nodes.find(n => n.type === 'pdf_generator');
    if (pdfNode && outputs[pdfNode.id]) {
      return outputs[pdfNode.id];
    }

    // Get last node in execution
    const nodeIds = Object.keys(outputs);
    if (nodeIds.length > 0) {
      return outputs[nodeIds[nodeIds.length - 1]];
    }

    return null;
  }

  /**
   * Cancel an active execution
   */
  async cancel(executionId) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) {
      throw new Error('Execution not found or already completed');
    }

    execution.status = 'cancelled';
    execution.endTime = new Date();
    await execution.save();

    this.activeExecutions.delete(executionId);
  }
}

module.exports = new WorkflowEngine();
