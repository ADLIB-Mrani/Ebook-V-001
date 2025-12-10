// API Client for Ebook Workflow Automation

const API_BASE = '/api';

const api = {
    // Workflows
    async getWorkflows() {
        const response = await fetch(`${API_BASE}/workflows`);
        if (!response.ok) throw new Error('Failed to fetch workflows');
        return await response.json();
    },

    async getWorkflow(id) {
        const response = await fetch(`${API_BASE}/workflows/${id}`);
        if (!response.ok) throw new Error('Failed to fetch workflow');
        return await response.json();
    },

    async createWorkflow(workflow) {
        const response = await fetch(`${API_BASE}/workflows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workflow)
        });
        if (!response.ok) throw new Error('Failed to create workflow');
        return await response.json();
    },

    async updateWorkflow(id, workflow) {
        const response = await fetch(`${API_BASE}/workflows/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workflow)
        });
        if (!response.ok) throw new Error('Failed to update workflow');
        return await response.json();
    },

    async deleteWorkflow(id) {
        const response = await fetch(`${API_BASE}/workflows/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete workflow');
        return await response.json();
    },

    async executeWorkflow(id, data = {}) {
        const response = await fetch(`${API_BASE}/workflows/${id}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to execute workflow');
        return await response.json();
    },

    async getWorkflowExecutions(id) {
        const response = await fetch(`${API_BASE}/workflows/${id}/executions`);
        if (!response.ok) throw new Error('Failed to fetch executions');
        return await response.json();
    },

    async getAvailableNodes() {
        const response = await fetch(`${API_BASE}/workflows/meta/nodes`);
        if (!response.ok) throw new Error('Failed to fetch nodes');
        return await response.json();
    },

    // Executions
    async getExecutions(status = null) {
        const url = status 
            ? `${API_BASE}/executions?status=${status}`
            : `${API_BASE}/executions`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch executions');
        return await response.json();
    },

    async getExecution(id) {
        const response = await fetch(`${API_BASE}/executions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch execution');
        return await response.json();
    },

    async getExecutionLogs(id) {
        const response = await fetch(`${API_BASE}/executions/${id}/logs`);
        if (!response.ok) throw new Error('Failed to fetch logs');
        return await response.json();
    }
};
