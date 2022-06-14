import { showNav } from './auth.js';
import { setUserData } from './units.js';

const baseUrl = 'http://localhost:3030/users/';

document.getElementById('register-form').addEventListener('submit', register);
document.getElementById('login-form').addEventListener('submit', login);

showNav();

function login(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    if (!email || !password) {
        return alert('All fields are required!');
    }

    const user = {
        email,
        password,
    };

    fetch(baseUrl + 'login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then((res) => res.json())
        .then((result) => checkResult(result))
        .catch((err) => console.error(err));
}

function register(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const rePass = formData.get('rePass').trim();

    if (!email || !password || !rePass) {
        return alert('All fields are required!');
    }

    if (password !== rePass) {
        return alert('Passwords don\'t match!');
    }

    const user = {
        email,
        password,
    };

    fetch(baseUrl + 'register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then((res) => res.json())
        .then((result) => checkResult(result))
        .catch((err) => console.error(err));
}

function checkResult(result) {
    if (result.code === 403) {
        return alert(result.message);
    } else {
        setUserData(result);
        showNav();
        window.location.href = 'homeLogged.html'
    }
}