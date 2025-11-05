// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }

    // Setup form handlers
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showNotification('Aucun compte trouvé avec cet email', 'error');
            return;
        }
        
        // Simple password check (in production, use proper hashing)
        if (user.password !== password) {
            showNotification('Mot de passe incorrect', 'error');
            return;
        }
        
        // Store current user
        const userData = {
            email: user.email,
            name: user.name,
            loggedInAt: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
        }
        
        showNotification('Connexion réussie ! Redirection...', 'success');
        
        // Redirect after 1 second
        setTimeout(() => {
            // Check if user has a plan
            const userPlan = localStorage.getItem('userPlan');
            if (userPlan) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'form.html';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Erreur lors de la connexion', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    
    // Validation
    if (password !== passwordConfirm) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    try {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showNotification('Un compte existe déjà avec cet email', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In production, hash this!
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login
        const userData = {
            email: newUser.email,
            name: newUser.name,
            loggedInAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showNotification('Compte créé avec succès ! Redirection...', 'success');
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 1000);
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Erreur lors de la création du compte', 'error');
    }
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

// Logout function (can be called from other pages)
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logout };
}
