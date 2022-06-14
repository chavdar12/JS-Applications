import { logout, showContent } from "./auth.js";
import { router } from "./router.js";

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);

const navElement = document.querySelector('nav');
navElement.addEventListener('click', checkPath)

showContent();

function checkPath(e) {
    e.preventDefault();

    if (e.target.tagName === 'A' && e.target.textContent !== 'Logout') {
        document.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        const url = new URL(e.target.href);
        router(url.pathname);
    }
}