import { setUserData } from "./utils.js";

const registerUrl = 'http://localhost:3030/users/register';

document.getElementById('register-form').addEventListener('submit', register);

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
        return alert('Passwords dont match!');
    }

    const user = {
        email,
        password,
    };

    e.target.reset();

    fetch(registerUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then((res) => res.json())
        .then((user) => setUserData(user))
        .catch((err) => console.error(err));
}