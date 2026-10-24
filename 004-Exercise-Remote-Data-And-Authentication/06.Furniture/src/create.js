import { initNav, request } from './api.js';

initNav();
document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
        if (Object.values(data).some((v) => v.trim() === '')) {
            throw new Error('All fields are required!');
        }
        await request('/data/furniture', 'POST', data);
        window.location.href = 'homeLogged.html';
    } catch (err) {
        alert(err.message);
    }
});
