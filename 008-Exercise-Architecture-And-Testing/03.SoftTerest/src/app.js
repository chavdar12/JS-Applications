import { logout } from "./api/api.js";
import { page, render } from "./lib.js";
import { getUserData } from "./util.js";
import { createPage } from "./views/create.js";

import { dashboardPage } from "./views/dashboard.js";
import { detailsPage } from "./views/details.js";
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from "./views/register.js";

const root = document.getElementById('main');
document.getElementById('logout-btn').addEventListener('click', onLogout);

page(decorateContext);
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/dashboard', dashboardPage);
page('/create', createPage);
page('/details/:id', detailsPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function onLogout() {
    logout();
    updateUserNav();
    page.redirect('/');
}

function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        document.querySelectorAll('.user').forEach((li) => {
            li.style.display = 'block';
        });

        document.querySelectorAll('.guest').forEach((li) => {
            li.style.display = 'none';
        });
    } else {
        document.querySelectorAll('.user').forEach((li) => {
            li.style.display = 'none';
        });

        document.querySelectorAll('.guest').forEach((li) => {
            li.style.display = 'block';
        });
    }
}