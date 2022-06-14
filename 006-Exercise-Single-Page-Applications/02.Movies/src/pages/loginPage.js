import { checkUser } from '../auth.js';
import { hideAllSections } from '../utils.js';

const url = 'http://localhost:3030/users/login';
document.getElementById('login-user').addEventListener('submit', login);

export function renderLogin() {
    hideAllSections();
    document.getElementById('form-login').style.display = 'block';
}

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

    e.target.reset();

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then((res) => res.json())
        .then((data) => checkUser(data))
        .catch((err) => console.error(err));
}