import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllFurnitures() {
    return api.get('/data/catalog');
}

export async function createFurniture(furniture) {
    return api.post('/data/catalog ', furniture);
}

export async function getFurnitureById(id) {
    return api.get('/data/catalog/' + id);
}

export async function deleteById(id) {
    return api.del('/data/catalog/' + id);
}

export async function updateFurniture(id, furniture) {
    return api.put('/data/catalog/' + id, furniture);
}

export async function getUserFurniture(userId) {
    return api.get(`/data/catalog?where=_ownerId%3D%22${userId}%22 `);
}