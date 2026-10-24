import page from 'page';
import { render } from 'lit-html';
import { getUser, logout } from './api.js';
import { catalogPage, myFurniturePage } from './views/catalog.js';
import { detailsPage } from './views/details.js';
import { createPage, editPage } from './views/form.js';
import { loginPage, registerPage } from './views/auth.js';

const container = document.querySelector('.container');

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    page.redirect('/');
});

page(decorateContext);
page('/index.html', '/');
page('/', catalogPage);
page('/details/:id', detailsPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/my-furniture', myFurniturePage);
page('/login', loginPage);
page('/register', registerPage);
page.start();

function decorateContext(ctx, next) {
    updateNav(ctx.pathname);
    ctx.render = (template) => render(template, container);
    ctx.user = getUser();
    next();
}

function updateNav(pathname) {
    const user = getUser();
    document.getElementById('user').style.display = user ? 'inline-block' : 'none';
    document.getElementById('guest').style.display = user ? 'none' : 'inline-block';
    document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === pathname));
}
