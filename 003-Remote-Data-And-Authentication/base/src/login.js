import { setUserData } from "./utils.js";

const loginUrl = 'http://localhost:3030/users/login'

document.getElementById('login-form').addEventListener('submit', login);

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

    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then((res) => res.json())
        .then((user) => setUserData(user))
        .catch((err) => console.error(err));
}