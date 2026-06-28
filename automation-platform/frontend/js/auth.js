const API_BASE = '/api';

const getStoredUser = () => {
    const local = localStorage.getItem('currentUser');
    const session = sessionStorage.getItem('currentUser');
    return local || session;
};

document.addEventListener('DOMContentLoaded', function() {
    if (getStoredUser()) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const payload = await response.json();
        if (!response.ok || !payload.success) {
            showNotification(payload.message || 'Identifiants invalides', 'error');
            return;
        }

        const userData = {
            ...payload.data.user,
            token: payload.data.token,
            loggedInAt: new Date().toISOString()
        };

        const targetStorage = rememberMe ? localStorage : sessionStorage;
        targetStorage.setItem('currentUser', JSON.stringify(userData));

        showNotification('Connexion réussie ! Redirection...', 'success');
        setTimeout(() => {
            const userPlan = localStorage.getItem('userPlan');
            window.location.href = userPlan ? 'dashboard.html' : 'form.html';
        }, 700);
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Erreur lors de la connexion', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (password !== passwordConfirm) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const payload = await response.json();
        if (!response.ok || !payload.success) {
            showNotification(payload.message || 'Erreur de création de compte', 'error');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify({
            ...payload.data.user,
            token: payload.data.token,
            loggedInAt: new Date().toISOString()
        }));

        showNotification('Compte créé avec succès ! Redirection...', 'success');
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 700);
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Erreur lors de la création du compte', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

    notification.appendChild(document.createTextNode(message));

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

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userPlan');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logout };
}
