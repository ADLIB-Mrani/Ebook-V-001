// Tasks Management
let tasks = [];
let currentFilter = 'all';

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    renderTasks();
    updateStats();
    renderReminders();
    
    // Setup form submission
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

function loadTasks() {
    const stored = localStorage.getItem('userTasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

function saveTasks() {
    localStorage.setItem('userTasks', JSON.stringify(tasks));
}

function addTask() {
    document.getElementById('addTaskForm').classList.remove('d-none');
    document.getElementById('taskTitle').focus();
}

function cancelAddTask() {
    document.getElementById('addTaskForm').classList.add('d-none');
    document.getElementById('taskForm').reset();
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    
    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    tasks.unshift(task);
    saveTasks();
    
    // Reset form
    document.getElementById('taskForm').reset();
    cancelAddTask();
    
    // Re-render
    renderTasks();
    updateStats();
    renderReminders();
    
    showNotification('Tâche ajoutée avec succès !', 'success');
    
    // Schedule reminder if due date is set
    if (dueDate) {
        scheduleReminder(task);
    }
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        updateStats();
        
        if (task.completed) {
            showNotification('Tâche terminée ! 🎉', 'success');
        }
    }
}

function deleteTask(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
        renderReminders();
        showNotification('Tâche supprimée', 'info');
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.btn-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    let html = '';
    
    filteredTasks.forEach(task => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        const priorityColors = {
            'low': 'success',
            'medium': 'warning',
            'high': 'danger'
        };
        
        const priorityLabels = {
            'low': 'Basse',
            'medium': 'Moyenne',
            'high': 'Haute'
        };
        
        html += `
            <div class="card mb-3 ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-danger' : ''}">
                <div class="card-body">
                    <div class="d-flex align-items-start">
                        <div class="form-check me-3">
                            <input class="form-check-input" type="checkbox" 
                                   ${task.completed ? 'checked' : ''} 
                                   onchange="toggleTask(${task.id})">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 ${task.completed ? 'text-decoration-line-through' : ''}">
                                ${task.title}
                                ${isOverdue ? '<span class="badge bg-danger ms-2">En retard</span>' : ''}
                            </h6>
                            ${task.description ? `<p class="small text-muted mb-2">${task.description}</p>` : ''}
                            <div class="d-flex gap-2 flex-wrap small">
                                <span class="badge bg-${priorityColors[task.priority]}">
                                    ${priorityLabels[task.priority]}
                                </span>
                                ${task.dueDate ? `
                                    <span class="badge bg-secondary">
                                        <i class="bi bi-calendar"></i> ${formatDate(task.dueDate)}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    taskList.innerHTML = html;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const today = new Date().toDateString();
    const completedToday = tasks.filter(t => 
        t.completed && new Date(t.completedAt).toDateString() === today
    ).length;
    const overdue = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('overdueCount').textContent = overdue;
    
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    document.getElementById('progressBar').style.width = percentage + '%';
}

function renderReminders() {
    const remindersList = document.getElementById('remindersList');
    const noReminders = document.getElementById('noReminders');
    
    // Get tasks with due dates in the next 7 days
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingTasks = tasks.filter(t => 
        !t.completed && t.dueDate && 
        new Date(t.dueDate) >= now && 
        new Date(t.dueDate) <= nextWeek
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    if (upcomingTasks.length === 0) {
        remindersList.innerHTML = '';
        noReminders.classList.remove('d-none');
        return;
    }
    
    noReminders.classList.add('d-none');
    
    let html = '';
    upcomingTasks.forEach(task => {
        const daysUntil = Math.ceil((new Date(task.dueDate) - now) / (1000 * 60 * 60 * 24));
        const timeText = daysUntil === 0 ? "Aujourd'hui" : 
                        daysUntil === 1 ? "Demain" : 
                        `Dans ${daysUntil} jours`;
        
        html += `
            <div class="d-flex align-items-start mb-2 pb-2 border-bottom">
                <i class="bi bi-bell-fill text-warning me-2"></i>
                <div class="flex-grow-1">
                    <small class="fw-bold d-block">${task.title}</small>
                    <small class="text-muted">${timeText}</small>
                </div>
            </div>
        `;
    });
    
    remindersList.innerHTML = html;
}

function scheduleReminder(task) {
    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        
        // Schedule notification for 1 day before
        const reminderTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
        
        if (reminderTime > now) {
            const timeUntilReminder = reminderTime - now;
            
            setTimeout(() => {
                new Notification('Rappel de tâche - PlanGenerator', {
                    body: `La tâche "${task.title}" est due demain !`,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico'
                });
            }, timeUntilReminder);
        }
        
        // Schedule notification for due date
        const timeUntilDue = dueDate - now;
        if (timeUntilDue > 0) {
            setTimeout(() => {
                new Notification('Tâche à accomplir - PlanGenerator', {
                    body: `La tâche "${task.title}" est due aujourd'hui !`,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico'
                });
            }, timeUntilDue);
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    const messageText = document.createTextNode(message);
    notification.appendChild(messageText);
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    notification.appendChild(closeButton);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
    }, 5000);
}
