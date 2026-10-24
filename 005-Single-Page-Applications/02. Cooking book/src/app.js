import { getToken, logout } from './api.js';
import { setupCatalog } from './catalog.js';
import { setupCreate } from './create.js';
import { setupAuth } from './auth.js';

const main = document.querySelector('main');
const nav = document.querySelector('nav');

const views = {};
const setups = {
    catalog: setupCatalog,
    create: setupCreate,
    login: (section, go) => setupAuth(section, go, 'login'),
    register: (section, go) => setupAuth(section, go, 'register')
};
for (const [name, setup] of Object.entries(setups)) {
    const section = document.getElementById(`${name}-view`);
    section.remove();
    views[name] = { section, show: setup(section, navigate) };
}

nav.addEventListener('click', (e) => {
    const view = e.target.dataset.view;
    if (view) {
        e.preventDefault();
        navigate(view);
    }
});
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    navigate('catalog');
});

navigate('catalog');

function navigate(name) {
    const view = views[name];
    updateNav(name);
    main.replaceChildren(view.section);
    view.show();
}

function updateNav(active) {
    const loggedIn = Boolean(getToken());
    document.getElementById('user').style.display = loggedIn ? 'inline-block' : 'none';
    document.getElementById('guest').style.display = loggedIn ? 'none' : 'inline-block';
    nav.querySelectorAll('[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === active));
}
