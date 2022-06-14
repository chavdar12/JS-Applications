import { showNav, logout } from "./auth.js";
import { getUserData } from "./units.js";

const createUrl = 'http://localhost:3030/data/furniture';

showNav();

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('create-form').addEventListener('submit', createFurniture);

function createFurniture(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const price = formData.get('price').trim();
    const factor = formData.get('factor').trim();
    const img = formData.get('img').trim();

    if (!name || !price || !factor || !img) {
        return alert('All fields are required!');
    }

    if (isNaN(Number(price))) {
        return alert('Price must be a number!');
    }

    if (isNaN(Number(factor))) {
        return alert('Factor must be a number!');
    }

    const furniture = {
        name,
        price,
        factor,
        img,
    };

    const userToken = getUserData().accessToken;

    fetch(createUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(furniture)
    })
        .then(() => window.location.href = 'homeLogged.html')
        .catch((err) => console.error(err));
}