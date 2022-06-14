import { clearUserData, getUserData } from "./utils.js";

const logoutUrl = 'http://localhost:3030/users/logout ';

export function showNav() {
    const user = getUserData();

    if (user) {
        document.getElementById('user').style.display = 'inline';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline';
    }
}

export function logout() {
    fetch(logoutUrl)
        .then(() => clearUserData())
        .then(() => showNav())
        .catch((err) => console.error(err));
}
