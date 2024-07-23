const admins = {
    'admin1': 'adminpass1',
    "password": "yussefali@12345",
    'admin2': 'adminpass2'
};

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';
    const errors = [];

    if (!validateName(firstName)) errors.push('First name is required and should only contain letters.');
    if (!validateName(lastName)) errors.push('Last name is required and should only contain letters.');
    if (!validateUsername(username)) errors.push('Username is required and should be 3-15 characters long, and can only contain letters, numbers, and underscores.');
    if (!validateEmail(email)) errors.push('Invalid email format.');
    if (!validatePassword(password)) errors.push('Password must be at least 8 characters long and include a number and a special character.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');

    if (errors.length > 0) {
        errorMessage.textContent = errors.join(' ');
        return;
    }

    if (registerUser(firstName, lastName, username, email, password)) {
        window.location.href = 'login.html';
    } else {
        errorMessage.textContent = 'User already exists.';
    }
});

function validateName(name) {
    const re = /^[A-Za-z]+$/;
    return re.test(name);
}

function validateUsername(username) {
    const re = /^[A-Za-z0-9_]{3,15}$/;
    return re.test(username);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
}

function registerUser(firstName, lastName, username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.username === username)) {
        return false;
    }
    const user = { firstName, lastName, username, email, password, isAdmin: false };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('User registered successfully');
    return true;
}
