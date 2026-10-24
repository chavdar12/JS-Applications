import { request } from './api.js';

export function setupCreate(section, navigate) {
    const form = section.querySelector('form');
    const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        try {
            await request('/data/recipes', 'POST', {
                name: data.name,
                img: data.img,
                ingredients: lines(data.ingredients),
                steps: lines(data.steps)
            });
            form.reset();
            navigate('catalog');
        } catch (err) {
            alert(err.message);
        }
    });

    return () => {};
}
