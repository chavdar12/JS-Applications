const BASE_URL = 'http://localhost:3030';

export function getUser() {
    return JSON.parse(localStorage.getItem('userData'));
}

async function request(path, method = 'GET', body) {
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
    if (res.status === 403 && user) {
        // stale token: the server was restarted
        localStorage.removeItem('userData');
    }
    if (!res.ok) {
        throw new Error((await res.json()).message);
    }
    return res.status === 204 ? null : res.json();
}

async function authenticate(action, credentials) {
    const data = await request(`/users/${action}`, 'POST', credentials);
    localStorage.setItem('userData', JSON.stringify({ email: data.email, id: data._id, token: data.accessToken }));
}

export const login = (email, password) => authenticate('login', { email, password });
export const register = (email, password) => authenticate('register', { email, password });

export async function logout() {
    await request('/users/logout');
    localStorage.removeItem('userData');
}

export const getIdeas = () => request('/data/ideas?select=_id%2Ctitle%2Cimg&sortBy=_createdOn%20desc');
export const getIdea = (id) => request(`/data/ideas/${id}`);
export const createIdea = (idea) => request('/data/ideas', 'POST', idea);
export const deleteIdea = (id) => request(`/data/ideas/${id}`, 'DELETE');
