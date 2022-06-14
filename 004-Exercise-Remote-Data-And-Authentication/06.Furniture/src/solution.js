import { logout, showNav } from "./auth.js";
import { getUserData } from "./units.js";

const baseUrl = 'http://localhost:3030/data/'

showNav();
getFurniture();

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('buy-btn')?.addEventListener('click', buyFurniture);
document.getElementById('show-orders-btn')?.addEventListener('click', getUserOrders);

function getFurniture() {
    fetch(baseUrl + 'furniture')
        .then((res) => res.json())
        .then((furniture) => showFurniture(furniture))
        .catch((err) => console.error(err));
}

function showFurniture(furniture) {
    let tBodyElement = document.querySelector('table.table tbody');
    let trElement = tBodyElement.querySelector('tr');

    tBodyElement.innerHTML = '';

    const user = getUserData();

    furniture.forEach((curr) => {
        let clonedTrElement = trElement.cloneNode(true);

        clonedTrElement.children[0].children[0].src = curr.img;
        clonedTrElement.children[1].children[0].textContent = curr.name;
        clonedTrElement.children[2].children[0].textContent = curr.price;
        clonedTrElement.children[3].children[0].textContent = curr.factor;
        clonedTrElement.children[4].children[0].disabled = !user;

        tBodyElement.appendChild(clonedTrElement);
    });
}

function buyFurniture() {
    let trElements = document.querySelectorAll('tbody tr');
    let boughtFurniture = [];
    let totalSum = 0;

    Array.from(trElements).forEach((tr) => {
        if (tr.children[4].children[0].checked) {
            boughtFurniture.push(tr.children[1].children[0].textContent);
            totalSum += Number(tr.children[2].children[0].textContent)
        }
    });

    if (boughtFurniture.length === 0 && totalSum === 0) {
        return alert('Nothing bought!');
    }

    const order = {
        boughtFurniture,
        totalSum,
    };

    const userToken = getUserData().accessToken;

    fetch(baseUrl + 'orders', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(order)
    })
        .then(() => window.location.href = 'homeLogged.html')
        .catch((err) => console.error(err));
}

function getUserOrders() {
    fetch(baseUrl + 'orders')
        .then((res) => res.json())
        .then((orders) => showOrders(orders))
        .catch((err) => console.error(err));
}

function showOrders(orders) {
    const userId = getUserData()._id;
    let totalSum = 0;
    let boughtFurniture = [];

    orders
        .filter((x) => x._ownerId === userId)
        .forEach((order) => {
            totalSum += Number(order.totalSum);
            boughtFurniture.push(...order.boughtFurniture);
        });

    let pElements = document.querySelectorAll('div.orders p');

    Array.from(pElements).forEach((p) => {
        p.style.display = 'block';
    });

    pElements[0].children[0].textContent = boughtFurniture.length> 0 ? boughtFurniture.join(', ') : 'Nothing bought yet!';
    pElements[1].children[0].textContent = `${totalSum} $`;
}
