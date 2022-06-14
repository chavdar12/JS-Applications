import { getAllMovies, renderHome } from './pages/homePage.js';
import { renderLogin } from './pages/loginPage.js';
import { hideAllSections, clearUserData, showNav, callRouter, checkPath } from './utils.js';

const logoutUrl = 'http://localhost:3030/users/logout';

showNav();
hideAllSections();
renderHome();
getAllMovies();
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('navbar-movies').addEventListener('click', checkNavPath);
document.querySelector('#add-movie-button a').addEventListener('click', checkPath);

function checkNavPath(e) {
    e.preventDefault();

    if (e.target.tagName === 'A' && e.target.textContent !== 'Logout') {
        callRouter(e.target.href)
    }
}

function logout() {
    fetch(logoutUrl)
        .then(() => clearUserData())
        .then(() => showNav())
        .then(() => hideAllSections())
        .then(() => renderLogin())
        .catch((err) => console.error(err));
}