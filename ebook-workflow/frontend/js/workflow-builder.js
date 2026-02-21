// Workflow Builder - Simple drag & drop workflow editor

class WorkflowBuilder {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.currentWorkflow = null;
        this.nodeIdCounter = 0;

        this.initCanvas();
    }

    initCanvas() {
        // Enable drop on canvas
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const nodeType = e.dataTransfer.getData('text/plain');
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addNode(nodeType, x, y);
        });
    }

    addNode(type, x, y, config = {}) {
        const nodeId = `node_${this.nodeIdCounter++}`;
        const node = {
            id: nodeId,
            type,
            position: { x, y },
            config
        };

        this.nodes.push(node);
        this.renderNode(node);
        return node;
    }

    renderNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'workflow-node';
        nodeElement.id = node.id;
        nodeElement.style.left = node.position.x + 'px';
        nodeElement.style.top = node.position.y + 'px';

        // Determine node category class
        const category = this.getNodeCategory(node.type);
        nodeElement.classList.add(`node-${category}`);

        nodeElement.innerHTML = `
            <div class="workflow-node-header">
                ${this.getNodeIcon(node.type)} ${this.getNodeName(node.type)}
            </div>
            <div class="workflow-node-type">${node.type}</div>
            <div class="workflow-node-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="builder.configureNode('${node.id}')">
                    <i class="bi bi-gear"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="builder.deleteNode('${node.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="node-connector input" data-node="${node.id}" data-type="input"></div>
            <div class="node-connector output" data-node="${node.id}" data-type="output"></div>
        `;

        // Make draggable
        this.makeDraggable(nodeElement);

        this.canvas.appendChild(nodeElement);
    }

    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;
            this.selectNode(element.id);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = (initialLeft + dx) + 'px';
            element.style.top = (initialTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Update node position in data
                const node = this.nodes.find(n => n.id === element.id);
                if (node) {
                    node.position.x = element.offsetLeft;
                    node.position.y = element.offsetTop;
                }
            }
        });
    }

    selectNode(nodeId) {
        // Remove previous selection
        document.querySelectorAll('.workflow-node').forEach(n => n.classList.remove('selected'));
        
        // Add selection
        const element = document.getElementById(nodeId);
        if (element) {
            element.classList.add('selected');
            this.selectedNode = nodeId;
        }
    }

    configureNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Show configuration modal
        const modal = new bootstrap.Modal(document.getElementById('nodeConfigModal'));
        const formContainer = document.getElementById('node-config-form');
        
        // Generate form based on node type
        formContainer.innerHTML = this.generateNodeConfigForm(node);
        
        // Save button handler
        document.getElementById('btn-save-node-config').onclick = () => {
            const formData = this.getFormData(formContainer);
            node.config = formData;
            modal.hide();
        };

        modal.show();
    }

    generateNodeConfigForm(node) {
        const nodeTypes = {
            trigger: [
                { name: 'triggerType', type: 'select', label: 'Type', options: ['manual', 'schedule', 'webhook'] }
            ],
            content_collector: [
                { name: 'source', type: 'select', label: 'Source', options: ['text', 'url', 'template'] },
                { name: 'content', type: 'textarea', label: 'Contenu', rows: 5 },
                { name: 'url', type: 'text', label: 'URL' },
                { name: 'template', type: 'select', label: 'Template', options: ['business_guide', 'programming_tutorial', 'student_resources'] }
            ],
            text_generator: [
                { name: 'mode', type: 'select', label: 'Mode', options: ['enhance', 'summarize', 'expand', 'translate'] },
                { name: 'addIntroduction', type: 'checkbox', label: 'Ajouter introduction' },
                { name: 'addConclusion', type: 'checkbox', label: 'Ajouter conclusion' }
            ],
            formatter: [
                { name: 'format', type: 'select', label: 'Format', options: ['html', 'markdown', 'plain'] },
                { name: 'fontSize', type: 'number', label: 'Taille police', min: 8, max: 24 },
                { name: 'includeTOC', type: 'checkbox', label: 'Table des matières' }
            ],
            pdf_generator: [
                { name: 'pageSize', type: 'select', label: 'Taille page', options: ['A4', 'Letter', 'A5'] },
                { name: 'margin', type: 'number', label: 'Marges', min: 20, max: 100 },
                { name: 'addCoverPage', type: 'checkbox', label: 'Page de couverture' }
            ],
            email_sender: [
                { name: 'to', type: 'email', label: 'Destinataire', required: true },
                { name: 'subject', type: 'text', label: 'Sujet' },
                { name: 'message', type: 'textarea', label: 'Message', rows: 4 }
            ],
            storage: [
                { name: 'storage', type: 'select', label: 'Stockage', options: ['local', 'cloud'] },
                { name: 'path', type: 'text', label: 'Chemin' },
                { name: 'keepOriginal', type: 'checkbox', label: 'Garder original' }
            ]
        };

        const fields = nodeTypes[node.type] || [];
        let html = `<h6>${this.getNodeName(node.type)}</h6><hr>`;

        fields.forEach(field => {
            const value = node.config[field.name] || '';
            
            if (field.type === 'select') {
                html += `
                    <div class="mb-3">
                        <label class="form-label">${field.label}</label>
                        <select class="form-select" name="${field.name}">
                            ${field.options.map(opt => 
                                `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                html += `
                    <div class="mb-3">
                        <label class="form-label">${field.label}</label>
                        <textarea class="form-control" name="${field.name}" rows="${field.rows || 3}">${value}</textarea>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                html += `
                    <div class="mb-3 form-check">
                        <input class="form-check-input" type="checkbox" name="${field.name}" ${value ? 'checked' : ''}>
                        <label class="form-check-label">${field.label}</label>
                    </div>
                `;
            } else {
                html += `
                    <div class="mb-3">
                        <label class="form-label">${field.label}</label>
                        <input type="${field.type}" class="form-control" name="${field.name}" 
                               value="${value}" ${field.required ? 'required' : ''}
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.max ? `max="${field.max}"` : ''}>
                    </div>
                `;
            }
        });

        return html;
    }

    getFormData(container) {
        const formData = {};
        container.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
        return formData;
    }

    deleteNode(nodeId) {
        if (confirm('Supprimer ce node ?')) {
            this.nodes = this.nodes.filter(n => n.id !== nodeId);
            const element = document.getElementById(nodeId);
            if (element) element.remove();
        }
    }

    getNodeCategory(type) {
        if (type === 'trigger') return 'trigger';
        if (['pdf_generator', 'email_sender', 'storage'].includes(type)) return 'output';
        return 'transform';
    }

    getNodeIcon(type) {
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

    getNodeName(type) {
        const names = {
            trigger: 'Déclencheur',
            content_collector: 'Collecteur',
            text_generator: 'Générateur',
            formatter: 'Formateur',
            pdf_generator: 'PDF',
            email_sender: 'Email',
            storage: 'Stockage'
        };
        return names[type] || type;
    }

    clearCanvas() {
        this.canvas.innerHTML = '';
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
    }

    loadWorkflow(workflow) {
        this.clearCanvas();
        this.currentWorkflow = workflow;
        
        workflow.nodes.forEach(node => {
            this.addNode(node.type, node.position.x, node.position.y, node.config);
        });
    }

    getWorkflowData() {
        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }
}
