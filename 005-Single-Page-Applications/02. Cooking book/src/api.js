const BASE_URL = 'http://localhost:3030';

export function getToken() {
    return sessionStorage.getItem('accessToken');
}

export async function request(path, method = 'GET', body) {
    const options = { method, headers: {} };
    if (getToken()) {
        options.headers['X-Authorization'] = getToken();
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
    sessionStorage.setItem('accessToken', data.accessToken);
}

export async function logout() {
    await request('/users/logout');
    sessionStorage.removeItem('accessToken');
}
