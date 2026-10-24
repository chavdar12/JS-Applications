const BASE_URL = 'http://localhost:3030';

export function getUser() {
    return JSON.parse(sessionStorage.getItem('userData'));
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
    if (!res.ok) {
        throw new Error((await res.json()).message);
    }
    return res.status === 204 ? null : res.json();
}

async function authenticate(action, credentials) {
    const data = await request(`/users/${action}`, 'POST', credentials);
    sessionStorage.setItem('userData', JSON.stringify({ email: data.email, id: data._id, token: data.accessToken }));
}

export const login = (email, password) => authenticate('login', { email, password });
export const register = (email, password) => authenticate('register', { email, password });

export async function logout() {
    await request('/users/logout');
    sessionStorage.removeItem('userData');
}

export const getRecipes = () => request('/data/recipes?select=_id%2Cname%2Cimg');
export const getRecipe = (id) => request(`/data/recipes/${id}`);
export const createRecipe = (recipe) => request('/data/recipes', 'POST', recipe);
export const updateRecipe = (id, recipe) => request(`/data/recipes/${id}`, 'PUT', recipe);
export const deleteRecipe = (id) => request(`/data/recipes/${id}`, 'DELETE');
