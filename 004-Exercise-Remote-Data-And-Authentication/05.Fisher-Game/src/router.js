import { renderHome } from './pages/homePage.js';
import { renderLogin } from './pages/loginPage.js';
import { renderRegister } from './pages/registerPage.js';

const routes = {
    '/': renderHome,
    '/login': renderLogin,
    '/register': renderRegister
}

export function router(path) {
    hideAllSections();

    const renderer = routes[path];
    renderer();
}

function hideAllSections() {
    let sections = document.querySelectorAll('section#views section');

    Array.from(sections).forEach((section) => {
        section.style.display = 'none';
    });
}