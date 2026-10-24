export const BASE_URL = 'http://localhost:3030';

export function getUser() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUser(data) {
    sessionStorage.setItem('userData', JSON.stringify({ email: data.email, id: data._id, token: data.accessToken }));
}

export async function request(path, method = 'GET', body) {
    const options = { method, headers: {} };
    const user = getUser();
    if (user) {
        options.headers['X-Authorization'] = user.token;
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    const res = await fetch(BASE_URL + path, options);
    if (!res.ok) {
        throw new Error((await res.json()).message);
    }
    return res.status === 204 ? null : res.json();
}

export function initNav() {
    const user = getUser();
    document.getElementById('user').style.display = user ? 'inline-block' : 'none';
    document.getElementById('guest').style.display = user ? 'none' : 'inline-block';
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await request('/users/logout');
        sessionStorage.removeItem('userData');
        window.location.href = 'home.html';
    });
}
