import { checkUser } from '../auth.js';
import { hideAllSections } from '../utils.js';

const url = 'http://localhost:3030/users/register';
document.getElementById('register-user').addEventListener('submit', register);

export function renderRegister() {
    hideAllSections();
    document.getElementById('form-sign-up').style.display = 'block';
}

function register(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const repeatPassword = formData.get('repeatPassword').trim();

    if (!email || !password || !repeatPassword) {
        return alert('All fields are required!');
    }

    if (password.length < 6) {
        return alert('Password must be at least 6 characters!');
    }

    if (password !== repeatPassword) {
        return alert('Password and confirm password don\'t match!');
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