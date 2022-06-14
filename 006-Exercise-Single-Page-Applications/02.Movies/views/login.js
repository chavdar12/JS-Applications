import {updateNav} from '../src/app.js';
import {showView} from '../src/dom.js';
import {makeRequest} from '../src/requests.js';
import {showHome} from './home.js';

const section = document.getElementById('form-login');

const form = section.querySelector('form');
form.addEventListener('submit', onLogin);

section.remove();

export function showLogin() {
    showView(section);
}

async function onLogin(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    try {
        const url = 'http://localhost:3030/users/login';
        const response = await makeRequest(url, 'POST', {email, password});

        if (response.ok !== true) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        sessionStorage.setItem('userData', JSON.stringify({
            email: data.email,
            id: data._id,
            token: data.accessToken
        }));

        form.reset();
        updateNav();
        showHome();
    } catch (error) {
        alert(error.message);
    }
}
