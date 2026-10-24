export const BASE_URL = 'http://localhost:3030';

export function getUser() {
    return JSON.parse(localStorage.getItem('userData'));
}

export function initNav(onLogout = () => {}) {
    updateNav();
    document.getElementById('logout').addEventListener('click', async () => {
        await fetch(`${BASE_URL}/users/logout`, { headers: { 'X-Authorization': getUser()?.token } });
        localStorage.removeItem('userData');
        updateNav();
        onLogout();
    });
}

function updateNav() {
    const user = getUser();
    document.getElementById('user').style.display = user ? 'inline-block' : 'none';
    document.getElementById('guest').style.display = user ? 'none' : 'inline-block';
    document.querySelector('nav .email span').textContent = user ? user.email : 'guest';
}

/** Logs in or registers and stores the session. Throws with the server message on failure. */
export async function authenticate(action, credentials) {
    const res = await fetch(`${BASE_URL}/users/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message);
    }
    localStorage.setItem('userData', JSON.stringify({ email: data.email, id: data._id, token: data.accessToken }));
}
