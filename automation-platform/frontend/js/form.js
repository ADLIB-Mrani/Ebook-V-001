let currentStep = 1;
const totalSteps = 4;
const API_BASE = '/api';

function nextStep(step) {
    if (!validateStep(currentStep)) return;

    document.getElementById(`step${currentStep}`).classList.add('d-none');
    document.getElementById(`step${step}`).classList.remove('d-none');
    updateProgressBar(step);
    currentStep = step;
    window.scrollTo(0, 0);
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    document.getElementById(`step${step}`).classList.remove('d-none');
    updateProgressBar(step);
    currentStep = step;
    window.scrollTo(0, 0);
}

function updateProgressBar(step) {
    const progressBar = document.getElementById('progressBar');
    const percentage = (step / totalSteps) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.textContent = `Étape ${step}/${totalSteps}`;
}

function validateStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (step === 2) {
        const planType = document.querySelector('input[name="planType"]:checked');
        if (!planType) {
            alert('Veuillez sélectionner un type de plan');
            isValid = false;
        }
    }

    return isValid;
}

const collectFormData = () => ({
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    age: document.getElementById('age').value,
    education: document.getElementById('education').value,
    field: document.getElementById('field').value,
    planType: document.querySelector('input[name="planType"]:checked').value,
    goal: document.getElementById('goal').value,
    timeline: document.getElementById('timeline').value,
    experience: document.getElementById('experience').value,
    skills: document.getElementById('skills').value,
    timePerWeek: document.getElementById('timePerWeek').value,
    budget: document.getElementById('budget').value,
    constraints: document.getElementById('constraints').value,
    notifications: {
        opportunities: document.getElementById('notifOpportunities').checked,
        resources: document.getElementById('notifResources').checked,
        reminders: document.getElementById('notifReminders').checked
    },
    frequency: document.getElementById('frequency').value,
    interests: document.getElementById('interests').value,
    createdAt: new Date().toISOString(),
    userId: generateUserId()
});

document.getElementById('planForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!validateStep(4)) return;

    const formData = collectFormData();

    try {
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        const response = await fetch(`${API_BASE}/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const payload = await response.json();

        if (!response.ok || !payload.success) {
            throw new Error(payload.message || 'Erreur de génération du plan');
        }

        const userPayload = payload.data?.user || formData;
        localStorage.setItem('userPlan', JSON.stringify(userPayload));

        window.location.href = `dashboard.html?id=${encodeURIComponent(formData.userId)}`;
    } catch (error) {
        console.error('Plan generation error:', error);

        localStorage.setItem('userPlan', JSON.stringify(formData));
        alert('Le serveur est indisponible, passage en mode local.');
        window.location.href = `dashboard.html?id=${encodeURIComponent(formData.userId)}`;
    }
});

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Form initialized');
});
