import { getUser, initNav, request } from './api.js';

const tbody = document.querySelector('tbody');
const user = getUser();

initNav();
document.getElementById('buy-btn')?.addEventListener('click', buy);
document.getElementById('show-orders-btn')?.addEventListener('click', showOrders);
loadFurniture();

async function loadFurniture() {
    const items = await request('/data/furniture');
    tbody.replaceChildren(...items.map(createRow));
}

function createRow(item) {
    const tr = document.createElement('tr');
    const imgTd = document.createElement('td');
    const img = document.createElement('img');
    img.src = item.img;
    imgTd.appendChild(img);
    tr.appendChild(imgTd);
    for (const text of [item.name, item.price, item.factor]) {
        const td = document.createElement('td');
        const p = document.createElement('p');
        p.textContent = text;
        td.appendChild(p);
        tr.appendChild(td);
    }
    const checkTd = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled = !user;
    checkTd.appendChild(checkbox);
    tr.appendChild(checkTd);
    return tr;
}

async function buy() {
    const orders = [...tbody.querySelectorAll('tr')]
        .filter((tr) => tr.querySelector('input:checked'))
        .map((tr) => {
            const [name, price] = [...tr.querySelectorAll('p')].map((p) => p.textContent);
            return { name, price: Number(price) };
        });
    await Promise.all(orders.map((order) => request('/data/orders', 'POST', order)));
    tbody.querySelectorAll('input:checked').forEach((cb) => (cb.checked = false));
}

async function showOrders() {
    const where = encodeURIComponent(`_ownerId="${user.id}"`);
    const orders = await request(`/data/orders?where=${where}`);
    const [names, total] = document.querySelectorAll('.orders span');
    names.textContent = orders.map((o) => o.name).join(', ');
    total.textContent = `${orders.reduce((sum, o) => sum + Number(o.price), 0)} $`;
}
