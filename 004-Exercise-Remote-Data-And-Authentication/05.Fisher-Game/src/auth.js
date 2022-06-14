import { clearUserData, getUserData } from "./utils.js";

const logoutUrl = 'http://localhost:3030/users/logout';

export function showContent() {
    const user = getUserData();

    if (user) {
        document.getElementById('user').style.display = 'inline';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('button.add').disabled = false;
        document.querySelector('nav span').textContent = getUserData().email;
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline';
        document.querySelector('button.add').disabled = true;
        document.querySelector('nav span').textContent = 'guest';
    }
}

export function showHome() {
    const user = getUserData();

    if (user) {
        document.getElementById('home-view').style.display = 'block';
        document.getElementById('register-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'none';
    }

    document.querySelector('fieldset#main').style.display = 'none';
}

export function logout() {
    fetch(logoutUrl)
        .then(() => clearUserData())
        .then(() => showContent())
        .then(() => showHome())
        .catch((err) => console.error(err));
}

