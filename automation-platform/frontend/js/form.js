// Form Navigation
let currentStep = 1;
const totalSteps = 4;

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show next step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update progress bar
    updateProgressBar(step);
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show previous step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update progress bar
    updateProgressBar(step);
    
    currentStep = step;
    
    // Scroll to top
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
    
    // Special validation for radio buttons in step 2
    if (step === 2) {
        const planType = document.querySelector('input[name="planType"]:checked');
        if (!planType) {
            alert('Veuillez sélectionner un type de plan');
            isValid = false;
        }
    }
    
    return isValid;
}

// Form Submission
document.getElementById('planForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateStep(4)) {
        return;
    }
    
    // Collect form data
    const formData = {
        // Personal Info
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        education: document.getElementById('education').value,
        field: document.getElementById('field').value,
        
        // Goals
        planType: document.querySelector('input[name="planType"]:checked').value,
        goal: document.getElementById('goal').value,
        timeline: document.getElementById('timeline').value,
        
        // Current Situation
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        timePerWeek: document.getElementById('timePerWeek').value,
        budget: document.getElementById('budget').value,
        constraints: document.getElementById('constraints').value,
        
        // Preferences
        notifications: {
            opportunities: document.getElementById('notifOpportunities').checked,
            resources: document.getElementById('notifResources').checked,
            reminders: document.getElementById('notifReminders').checked
        },
        frequency: document.getElementById('frequency').value,
        interests: document.getElementById('interests').value,
        
        // Metadata
        createdAt: new Date().toISOString(),
        userId: generateUserId()
    };
    
    // Show loading modal
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
    
    // Simulate plan generation (replace with actual API call)
    setTimeout(() => {
        // Save to localStorage for demo
        localStorage.setItem('userPlan', JSON.stringify(formData));
        
        // Redirect to dashboard
        window.location.href = `dashboard.html?id=${formData.userId}`;
    }, 3000);
});

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Remove invalid class on input
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form initialized');
});
