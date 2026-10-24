document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { email, password, rePass } = Object.fromEntries(new FormData(e.target));

    try {
        if (!email || !password) {
            throw new Error('All fields are required!');
        }
        if (password !== rePass) {
            throw new Error('Passwords don\'t match!');
        }
        const res = await fetch('http://localhost:3030/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message);
        }
        sessionStorage.setItem('accessToken', data.accessToken);
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
    }
});
