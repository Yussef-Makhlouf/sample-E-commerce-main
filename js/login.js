const admins = {
    'admin1': 'adminpass1', // Replace with your admin username and password
    'admin2': 'adminpass2' // Replace with your admin username and password
};

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';
    const errors = [];

    if (!validateUsername(username)) errors.push('Username is required and should be 3-15 characters long, and can only contain letters, numbers, and underscores.');
    if (!password) errors.push('Password is required.');

    if (errors.length > 0) {
        errorMessage.textContent = errors.join(' ');
        return;
    }

    if (loginUser(username, password)) {
        window.location.href = 'products.html';
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
});

function validateUsername(username) {
    const re = /^[A-Za-z0-9_]{3,15}$/;
    return re.test(username);
}

function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        if (admins[username] && admins[username] === password) {
            user.isAdmin = true;
        } else {
            user.isAdmin = false;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Login successful. Welcome, ${user.firstName} ${user.lastName}`);
        return true;
    }
    return false;
}