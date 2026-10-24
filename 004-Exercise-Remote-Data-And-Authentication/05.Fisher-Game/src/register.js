import { authenticate, initNav } from './nav.js';

initNav();

const form = document.getElementById('register-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { email, password, rePass } = Object.fromEntries(new FormData(form));
    try {
        if (!email || !password) {
            throw new Error('All fields are required!');
        }
        if (password !== rePass) {
            throw new Error('Passwords don\'t match!');
        }
        await authenticate('register', { email, password });
        window.location.href = 'index.html';
    } catch (err) {
        form.querySelector('.notification').textContent = err.message;
    }
});
