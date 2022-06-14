import { router } from './router.js';

export function getUserData() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setUserData(data) {
    localStorage.setItem('user', JSON.stringify(data));
}

export function clearUserData() {
    localStorage.removeItem('user')
}

export function hideAllSections() {
    let sections = document.querySelectorAll('section');

    Array.from(sections).forEach((section) => {
        section.style.display = 'none';
    });
}

export function showNav() {
    const user = getUserData();

    let loggedInUserElements = document.querySelectorAll('li.logged-in-user');
    let guestElements = document.querySelectorAll('li.guest');
    let addButtonElement = document.getElementById('add-movie-button');

    if (user) {
        Array.from(loggedInUserElements).forEach((li) => {
            li.style.display = 'block';
        });

        Array.from(guestElements).forEach((li) => {
            li.style.display = 'none';
        });

        document.getElementById('welcome-user-email').textContent = `Welcome, ${user.email}`;
        addButtonElement.style.display = 'block';
    } else {
        Array.from(loggedInUserElements).forEach((li) => {
            li.style.display = 'none';
        });

        Array.from(guestElements).forEach((li) => {
            li.style.display = 'block';
        });

        addButtonElement.style.display = 'none';
    }
}

export function callRouter(href, id) {
    const url = new URL(href);
    router(url.pathname, id);
}

export function checkPath(e) {
    e.preventDefault();
    let href;

    if (e.target.tagName === 'BUTTON') {
        href = `http://127.0.0.1:5500/details-movie`;
        callRouter(href, e.target.id);
    } else if (e.target.tagName === 'A' && e.target.hasAttribute('data-id')) {
        href = e.target.href;
        callRouter(href, e.target.getAttribute('data-id'));
    } else if (e.target.tagName === 'A') {
        href = e.target.href;
        callRouter(href);
    }
}