import { showContent, showHome } from "../auth.js";
import { setUserData } from "../utils.js";

const url = 'http://localhost:3030/users/register';

document.querySelector('form#register').addEventListener('submit', register);

export function renderRegister() {
    document.getElementById('register-view').style.display = 'block';
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
        return alert('Password und confirm password don\'t match!');
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