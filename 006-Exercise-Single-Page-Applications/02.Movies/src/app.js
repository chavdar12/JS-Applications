import { getUser, logout } from './api.js';
import { setupHome } from './home.js';
import { setupDetails } from './details.js';
import { setupMovieForm } from './movie-form.js';
import { setupAuth } from './auth.js';

const container = document.getElementById('container');
const footer = container.querySelector('footer');

const setups = {
    'home': setupHome,
    'add-movie': (s, go) => setupMovieForm(s, go, 'add'),
    'movie-example': setupDetails,
    'edit-movie': (s, go) => setupMovieForm(s, go, 'edit'),
    'form-login': (s, go) => setupAuth(s, go, 'login'),
    'form-sign-up': (s, go) => setupAuth(s, go, 'register')
};
const names = { 'home': 'home', 'add': 'add-movie', 'details': 'movie-example', 'edit': 'edit-movie', 'login': 'form-login', 'register': 'form-sign-up' };
const routes = { '/': 'home', '/add-movie': 'add', '/login': 'login', '/register': 'register' };

const views = {};
for (const [id, setup] of Object.entries(setups)) {
    const section = document.getElementById(id);
    section.remove();
    views[id] = { section, show: setup(section, navigate) };
}

container.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    const route = link && routes[link.getAttribute('href')];
    if (route) {
        e.preventDefault();
        navigate(route);
    }
});
document.getElementById('logout-btn').addEventListener('click', async () => {
    await logout();
    navigate('login');
});

navigate('home');

function navigate(name, ...params) {
    const view = views[names[name]];
    updateNav();
    container.querySelector(':scope > section')?.remove();
    container.insertBefore(view.section, footer);
    return view.show(...params);
}

function updateNav() {
    const user = getUser();
    document.querySelectorAll('.logged-in-user').forEach((li) => (li.style.display = user ? '' : 'none'));
    document.querySelectorAll('.guest').forEach((li) => (li.style.display = user ? 'none' : ''));
    document.getElementById('welcome-user-email').textContent = `Welcome, ${user ? user.email : 'guest'}`;
}
