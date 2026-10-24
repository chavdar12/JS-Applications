import { authenticate } from './api.js';

/** Wires the login or register form; on success goes home. */
export function setupAuth(section, navigate, action) {
    const form = section.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { email, password, repeatPassword } = Object.fromEntries(new FormData(form));
        try {
            if (!email || !password) {
                throw new Error('All fields are required!');
            }
            if (action === 'register') {
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long!');
                }
                if (password !== repeatPassword) {
                    throw new Error('Passwords don\'t match!');
                }
            }
            await authenticate(action, { email, password });
            form.reset();
            navigate('home');
        } catch (err) {
            alert(err.message);
        }
    });

    return () => {};
}
