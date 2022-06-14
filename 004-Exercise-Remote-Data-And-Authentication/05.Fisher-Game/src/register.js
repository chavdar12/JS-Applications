window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', onRegister);
});

async function onRegister(ev) {
    ev.preventDefault();
    const formData = new FormData(ev.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword = formData.get('rePass');

    const url = 'http://localhost:3030/users/register';
    try {
        if (password !== rePassword) {
            throw new Error('Passwords do not match.');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok !== true) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.pathname = '/05.Fisher-Game/src/index.html';
    } catch (error) {
        alert(error.message);
    }
}
