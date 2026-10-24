const BASE_URL = 'http://localhost:3030';

export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
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

export async function authenticate(action, credentials) {
    const data = await request(`/users/${action}`, 'POST', credentials);
    localStorage.setItem('user', JSON.stringify({ email: data.email, id: data._id, token: data.accessToken }));
}

export async function logout() {
    await request('/users/logout');
    localStorage.removeItem('user');
}
