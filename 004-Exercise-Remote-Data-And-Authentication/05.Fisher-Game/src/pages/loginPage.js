import { showContent, showHome } from "../auth.js";
import { setUserData } from "../utils.js";

const url = 'http://localhost:3030/users/login';

document.querySelector('form#login').addEventListener('submit', login);

export function renderLogin() {
    document.getElementById('login-view').style.display = 'block';
}

export function login(e) {
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

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then((res) => res.json())
        .then((user) => setUserData(user))
        .then(() => showContent())
        .then(() => showHome())
        .catch((err) => console.error(err));
}