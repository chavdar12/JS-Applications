import {updateNav} from '../src/app.js';
import {showView} from '../src/dom.js';
import {makeRequest} from '../src/requests.js';
import {showHome} from './home.js';

const section = document.getElementById('form-sign-up');
const form = section.querySelector('form');
form.addEventListener('submit', onRegister);
section.remove();

export function showRegister() {
    showView(section);
}

async function onRegister(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const rePassword = formData.get('repeatPassword').trim();

    if (email == '' || password == '' || rePassword == '') {
        alert('All fields are required');
        return;
    }

    if (password != rePassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const body = {
            email: email,
            password: password,
            repeatPassword: rePassword
        };
        const url = 'http://localhost:3030/users/register';
        const response = await makeRequest(url, 'POST', body);

        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         password: password,
        //         repeatPassword: rePassword
        //     })
        // })

        if (response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
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
    } catch (err) {
        alert(err.message);
    }
}
