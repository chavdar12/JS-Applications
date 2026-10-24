import { authenticate, initNav } from './nav.js';

initNav();

const form = document.getElementById('login-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(form));
    try {
        await authenticate('login', { email, password });
        window.location.href = 'index.html';
    } catch (err) {
        form.querySelector('.notification').textContent = err.message;
    }
});
