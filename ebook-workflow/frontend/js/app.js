// Main Application Logic

let builder;
let availableNodes = [];
let workflows = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize workflow builder
    builder = new WorkflowBuilder('workflow-canvas');
    
    // Load available nodes
    await loadAvailableNodes();
    
    // Load workflows
    await loadWorkflows();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load templates
    loadTemplates();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('nav-workflows').addEventListener('click', (e) => {
        e.preventDefault();
        showView('workflows-view');
        loadWorkflows();
    });
    
    document.getElementById('nav-executions').addEventListener('click', (e) => {
        e.preventDefault();
        showView('executions-view');
        loadExecutions();
    });
    
    document.getElementById('nav-templates').addEventListener('click', (e) => {
        e.preventDefault();
        showView('templates-view');
    });
    
    // Workflow actions
    document.getElementById('btn-new-workflow').addEventListener('click', createNewWorkflow);
    document.getElementById('btn-back').addEventListener('click', () => {
        showView('workflows-view');
        loadWorkflows();
    });
    document.getElementById('btn-save-workflow').addEventListener('click', saveWorkflow);
    document.getElementById('btn-execute-workflow').addEventListener('click', executeCurrentWorkflow);
    
    // Executions
    document.getElementById('btn-refresh-executions').addEventListener('click', loadExecutions);
}

// View management
function showView(viewId) {
    document.querySelectorAll('.view-container').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    
    // Update nav
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    if (viewId === 'workflows-view') document.getElementById('nav-workflows').classList.add('active');
    if (viewId === 'executions-view') document.getElementById('nav-executions').classList.add('active');
    if (viewId === 'templates-view') document.getElementById('nav-templates').classList.add('active');
}

// Load available nodes
async function loadAvailableNodes() {
    try {
        availableNodes = await api.getAvailableNodes();
        renderNodePalette();
    } catch (error) {
        console.error('Failed to load nodes:', error);
        showError('Erreur lors du chargement des nodes');
    }
}

// Render node palette
function renderNodePalette() {
    const palette = document.getElementById('node-palette');
    palette.innerHTML = '';
    
    availableNodes.forEach(node => {
        const item = document.createElement('div');
        item.className = 'node-palette-item';
        item.draggable = true;
        item.innerHTML = `
            <div>
                ${getNodeIcon(node.type)} <strong>${node.name}</strong>
                <small>${node.description}</small>
            </div>
        `;
        
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', node.type);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        palette.appendChild(item);
    });
}

// Load workflows
async function loadWorkflows() {
    try {
        workflows = await api.getWorkflows();
        renderWorkflows();
    } catch (error) {
        console.error('Failed to load workflows:', error);
        showError('Erreur lors du chargement des workflows');
    }
}

// Render workflows list
function renderWorkflows() {
    const container = document.getElementById('workflows-list');
    
    if (workflows.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center text-muted py-5">
                    <i class="bi bi-diagram-3" style="font-size: 4rem;"></i>
                    <p class="mt-3">Aucun workflow. Créez-en un pour commencer !</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = workflows.map(workflow => `
        <div class="col-md-4 mb-3">
            <div class="card workflow-card" onclick="editWorkflow('${workflow._id}')">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="bi bi-diagram-3"></i> ${workflow.name}
                    </h5>
                    <p class="card-text text-muted">${workflow.description || 'Pas de description'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="workflow-status ${workflow.status}">${workflow.status}</span>
                        <span class="text-muted small">${workflow.nodes.length} nodes</span>
                    </div>
                    <hr>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); executeWorkflow('${workflow._id}')">
                            <i class="bi bi-play"></i> Exécuter
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteWorkflow('${workflow._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Create new workflow
function createNewWorkflow() {
    builder.clearCanvas();
    builder.currentWorkflow = null;
    document.getElementById('workflow-name').value = 'Nouveau Workflow';
    showView('builder-view');
}

// Edit workflow
async function editWorkflow(id) {
    try {
        const workflow = await api.getWorkflow(id);
        builder.loadWorkflow(workflow);
        document.getElementById('workflow-name').value = workflow.name;
        showView('builder-view');
    } catch (error) {
        console.error('Failed to load workflow:', error);
        showError('Erreur lors du chargement du workflow');
    }
}

// Save workflow
async function saveWorkflow() {
    const name = document.getElementById('workflow-name').value.trim();
    if (!name) {
        alert('Veuillez entrer un nom pour le workflow');
        return;
    }
    
    const workflowData = builder.getWorkflowData();
    const workflow = {
        name,
        description: '',
        nodes: workflowData.nodes,
        connections: workflowData.connections,
        status: 'active'
    };
    
    try {
        if (builder.currentWorkflow && builder.currentWorkflow._id) {
            await api.updateWorkflow(builder.currentWorkflow._id, workflow);
            showSuccess('Workflow mis à jour avec succès !');
        } else {
            await api.createWorkflow(workflow);
            showSuccess('Workflow créé avec succès !');
        }
        
        showView('workflows-view');
        loadWorkflows();
    } catch (error) {
        console.error('Failed to save workflow:', error);
        showError('Erreur lors de la sauvegarde du workflow');
    }
}

// Execute workflow
async function executeWorkflow(id) {
    if (!confirm('Exécuter ce workflow ?')) return;
    
    try {
        showInfo('Exécution du workflow en cours...');
        await api.executeWorkflow(id);
        showSuccess('Workflow exécuté avec succès ! Consultez l\'historique pour voir les résultats.');
    } catch (error) {
        console.error('Failed to execute workflow:', error);
        showError('Erreur lors de l\'exécution du workflow');
    }
}

// Execute current workflow
async function executeCurrentWorkflow() {
    if (!builder.currentWorkflow || !builder.currentWorkflow._id) {
        alert('Veuillez d\'abord enregistrer le workflow');
        return;
    }
    
    await executeWorkflow(builder.currentWorkflow._id);
}

// Delete workflow
async function deleteWorkflow(id) {
    if (!confirm('Supprimer ce workflow définitivement ?')) return;
    
    try {
        await api.deleteWorkflow(id);
        showSuccess('Workflow supprimé');
        loadWorkflows();
    } catch (error) {
        console.error('Failed to delete workflow:', error);
        showError('Erreur lors de la suppression');
    }
}

// Load executions
async function loadExecutions() {
    try {
        const executions = await api.getExecutions();
        renderExecutions(executions);
    } catch (error) {
        console.error('Failed to load executions:', error);
        showError('Erreur lors du chargement des exécutions');
    }
}

// Render executions
function renderExecutions(executions) {
    const tbody = document.getElementById('executions-list');
    
    if (executions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucune exécution</td></tr>';
        return;
    }
    
    tbody.innerHTML = executions.map(exec => `
        <tr>
            <td>${exec.workflowName}</td>
            <td>
                <span class="execution-status ${exec.status}">
                    ${exec.status === 'running' ? '<i class="bi bi-arrow-clockwise running-animation"></i>' : ''}
                    ${exec.status}
                </span>
            </td>
            <td>${new Date(exec.startTime).toLocaleString('fr-FR')}</td>
            <td>${exec.duration ? (exec.duration / 1000).toFixed(2) + 's' : '-'}</td>
            <td>
                ${exec.result && exec.result.ebookPath 
                    ? `<a href="${exec.result.ebookUrl}" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-download"></i> Télécharger</a>` 
                    : '-'}
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewExecutionLogs('${exec._id}')">
                    <i class="bi bi-eye"></i> Logs
                </button>
            </td>
        </tr>
    `).join('');
}

// View execution logs
async function viewExecutionLogs(id) {
    try {
        const logs = await api.getExecutionLogs(id);
        let logsHtml = '<div class="list-group">';
        
        logs.forEach(log => {
            const icon = log.status === 'success' ? 'check-circle' : 
                        log.status === 'error' ? 'x-circle' : 'clock';
            const color = log.status === 'success' ? 'success' : 
                         log.status === 'error' ? 'danger' : 'secondary';
            
            logsHtml += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6><i class="bi bi-${icon} text-${color}"></i> ${log.nodeName}</h6>
                        <small>${log.endTime ? new Date(log.endTime).toLocaleTimeString('fr-FR') : 'En cours...'}</small>
                    </div>
                    ${log.error ? `<p class="text-danger mb-0"><small>${log.error}</small></p>` : ''}
                </div>
            `;
        });
        
        logsHtml += '</div>';
        
        // Show in modal
        const modalHtml = `
            <div class="modal fade" id="logsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Logs d'exécution</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${logsHtml}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('logsModal'));
        modal.show();
        
        // Cleanup on hide
        document.getElementById('logsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
        
    } catch (error) {
        console.error('Failed to load logs:', error);
        showError('Erreur lors du chargement des logs');
    }
}

// Load templates
function loadTemplates() {
    const templates = [
        {
            name: 'Ebook Simple',
            description: 'Template basique pour créer un ebook depuis du texte',
            icon: 'bi-file-pdf',
            nodes: [
                { type: 'trigger', position: { x: 50, y: 100 } },
                { type: 'content_collector', position: { x: 280, y: 100 }, config: { source: 'template', template: 'business_guide' } },
                { type: 'text_generator', position: { x: 510, y: 100 }, config: { mode: 'enhance' } },
                { type: 'formatter', position: { x: 740, y: 100 }, config: { format: 'html' } },
                { type: 'pdf_generator', position: { x: 50, y: 300 }, config: { pageSize: 'A4' } }
            ]
        },
        {
            name: 'Ebook avec Email',
            description: 'Créer un ebook et l\'envoyer par email',
            icon: 'bi-envelope',
            nodes: [
                { type: 'trigger', position: { x: 50, y: 100 } },
                { type: 'content_collector', position: { x: 280, y: 100 }, config: { source: 'template' } },
                { type: 'text_generator', position: { x: 510, y: 100 } },
                { type: 'formatter', position: { x: 740, y: 100 } },
                { type: 'pdf_generator', position: { x: 50, y: 300 } },
                { type: 'email_sender', position: { x: 280, y: 300 } }
            ]
        },
        {
            name: 'Scraping vers Ebook',
            description: 'Scraper un site web et créer un ebook',
            icon: 'bi-globe',
            nodes: [
                { type: 'trigger', position: { x: 50, y: 100 } },
                { type: 'content_collector', position: { x: 280, y: 100 }, config: { source: 'url' } },
                { type: 'text_generator', position: { x: 510, y: 100 }, config: { mode: 'summarize' } },
                { type: 'formatter', position: { x: 740, y: 100 } },
                { type: 'pdf_generator', position: { x: 50, y: 300 } },
                { type: 'storage', position: { x: 280, y: 300 } }
            ]
        }
    ];
    
    const container = document.getElementById('templates-list');
    container.innerHTML = templates.map((template, index) => `
        <div class="col-md-4 mb-4">
            <div class="card template-card" onclick="useTemplate(${index})">
                <div class="card-body text-center">
                    <div class="template-icon">
                        <i class="${template.icon}"></i>
                    </div>
                    <h5 class="card-title">${template.name}</h5>
                    <p class="card-text text-muted">${template.description}</p>
                    <button class="btn btn-primary btn-sm">
                        <i class="bi bi-plus-circle"></i> Utiliser ce template
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Store templates globally
    window.workflowTemplates = templates;
}

// Use template
function useTemplate(index) {
    const template = window.workflowTemplates[index];
    builder.clearCanvas();
    builder.currentWorkflow = null;
    
    template.nodes.forEach(nodeData => {
        builder.addNode(nodeData.type, nodeData.position.x, nodeData.position.y, nodeData.config || {});
    });
    
    document.getElementById('workflow-name').value = template.name;
    showView('builder-view');
}

// Helper functions
function getNodeIcon(type) {
    const icons = {
        trigger: '<i class="bi bi-lightning"></i>',
        content_collector: '<i class="bi bi-collection"></i>',
        text_generator: '<i class="bi bi-file-text"></i>',
        formatter: '<i class="bi bi-palette"></i>',
        pdf_generator: '<i class="bi bi-file-pdf"></i>',
        email_sender: '<i class="bi bi-envelope"></i>',
        storage: '<i class="bi bi-hdd"></i>'
    };
    return icons[type] || '<i class="bi bi-box"></i>';
}

// Notification helpers
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'danger');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
