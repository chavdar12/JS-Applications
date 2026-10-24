import page from 'page';
import { render } from 'lit-html';
import { getUser, logout } from './api.js';
import { homePage } from './views/home.js';
import { dashboardPage } from './views/dashboard.js';
import { detailsPage } from './views/details.js';
import { createPage } from './views/create.js';
import { loginPage, registerPage } from './views/auth.js';

const main = document.getElementById('main');

document.getElementById('logout-btn').addEventListener('click', async () => {
    await logout();
    updateNav();
    page.redirect('/');
});

page(decorateContext);
page('/index.html', '/');
page('/', homePage);
page('/dashboard', dashboardPage);
page('/details/:id', detailsPage);
page('/create', createPage);
page('/login', loginPage);
page('/register', registerPage);

updateNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (template) => render(template, main);
    ctx.updateNav = updateNav;
    next();
}

function updateNav() {
    const user = getUser();
    document.querySelectorAll('.user').forEach((li) => (li.style.display = user ? '' : 'none'));
    document.querySelectorAll('.guest').forEach((li) => (li.style.display = user ? 'none' : ''));
}
