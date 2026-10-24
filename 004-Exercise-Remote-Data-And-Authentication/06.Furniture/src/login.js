import { initNav, request, setUser } from './api.js';

initNav();
document.getElementById('register-form').addEventListener('submit', (e) => onSubmit(e, 'register'));
document.getElementById('login-form').addEventListener('submit', (e) => onSubmit(e, 'login'));

async function onSubmit(e, action) {
    e.preventDefault();
    const { email, password, rePass } = Object.fromEntries(new FormData(e.target));
    try {
        if (!email || !password) {
            throw new Error('All fields are required!');
        }
        if (action === 'register' && password !== rePass) {
            throw new Error('Passwords don\'t match!');
        }
        setUser(await request(`/users/${action}`, 'POST', { email, password }));
        window.location.href = 'homeLogged.html';
    } catch (err) {
        alert(err.message);
    }
}
