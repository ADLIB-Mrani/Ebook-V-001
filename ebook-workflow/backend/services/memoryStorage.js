/**
 * In-memory storage for demo mode (when MongoDB is not available)
 */
class MemoryStorage {
  constructor() {
    this.workflows = new Map();
    this.executions = new Map();
    this.idCounter = 1;
  }

  // Workflows
  saveWorkflow(workflow) {
    if (!workflow._id) {
      workflow._id = `wf_${this.idCounter++}`;
      workflow.createdAt = new Date();
    }
    workflow.updatedAt = new Date();
    this.workflows.set(workflow._id, workflow);
    return workflow;
  }

  getWorkflow(id) {
    return this.workflows.get(id);
  }

  getAllWorkflows() {
    return Array.from(this.workflows.values());
  }

  deleteWorkflow(id) {
    return this.workflows.delete(id);
  }

  // Executions
  saveExecution(execution) {
    if (!execution._id) {
      execution._id = `ex_${this.idCounter++}`;
    }
    this.executions.set(execution._id, execution);
    return execution;
  }

  getExecution(id) {
    return this.executions.get(id);
  }

  getAllExecutions() {
    return Array.from(this.executions.values()).sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
  }

  getExecutionsByWorkflow(workflowId) {
    return Array.from(this.executions.values())
      .filter(ex => ex.workflowId === workflowId)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }
}

module.exports = new MemoryStorage();
