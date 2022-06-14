const registerBtn = document.getElementById('registerBtn');
registerBtn.addEventListener('click', redirectToRegister);

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', redirectToLogin);

function redirectToRegister() {
    window.location = '/05.Fisher-Game/src/register.html';
}

function redirectToLogin() {
    window.location = '/05.Fisher-Game/src/login.html';
}