import { authenticate } from './api.js';

/** Wires the login or register form; on success goes to the catalog. */
export function setupAuth(section, navigate, action) {
    const form = section.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { email, password, rePass } = Object.fromEntries(new FormData(form));
        try {
            if (!email || !password) {
                throw new Error('All fields are required!');
            }
            if (action === 'register' && password !== rePass) {
                throw new Error('Passwords don\'t match!');
            }
            await authenticate(action, { email, password });
            form.reset();
            navigate('catalog');
        } catch (err) {
            alert(err.message);
        }
    });

    return () => {};
}
