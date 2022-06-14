window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', onLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', onRegister);
    }

    const createForm = document.getElementById('createForm');
    if (createForm) {
        createForm.addEventListener('submit', onFurnitureCreate);
    }

    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', onBuy);
        loadFurniture();
        clearOrders();
    }

    const allOrdersBtn = document.getElementById('allOrdersBtn');
    if (allOrdersBtn) {
        allOrdersBtn.addEventListener('click', getAllOrders);
    }
})

async function loadFurniture() {
    const url = 'http://localhost:3030/data/furniture';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const furnitures = await response.json();

    const tbody = document.querySelector('tbody');

    tbody.replaceChildren(...furnitures.map(createRow));
}

async function getAllOrders() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
        window.location.pathname = '/06.Furniture/login.html'
    }

    const url = `http://localhost:3030/data/orders/`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Authorization': userData.token
        }
    });

    const data = await response.json();

    for (const key of Object.values(data)) {
        showOrders(key);
    }
}

function clearOrders() {
    const ordersDiv = document.querySelector('.orders');

    const boughtFurniture = ordersDiv.children[0];
    boughtFurniture.textContent = '';

    const price = ordersDiv.children[1];
    price.textContent = '';
}

function showOrders(data) {
    const ordersDiv = document.querySelector('.orders');

    const boughtFurniture = ordersDiv.children[0];
    const furnitureSpan = document.createElement('span');
    furnitureSpan.textContent = `${data.names.join(', ')}`;
    boughtFurniture.textContent = `Bought furniture: `;
    boughtFurniture.appendChild(furnitureSpan);

    const price = ordersDiv.children[1];
    let totalPrice = data.total.reduce((acc, curr) => acc + curr, 0);
    price.textContent = `Total price: `;
    const priceSpan = document.createElement('span');
    priceSpan.textContent = `${totalPrice} $`;
    price.appendChild(priceSpan);
}

async function onBuy() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
        window.location.pathname = '/06.Furniture/login.html'
    }

    let furniture = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(f => f.parentElement.parentElement)
        .map(f => ({
            name: f.children[1].textContent,
            price: Number(f.children[2].textContent),
            factor: Number(f.children[3].textContent)
        }))
        .reduce((acc, curr) => {
            acc.names.push(curr.name);
            acc.total.push(curr.price);

            return acc;
        }, {names: [], total: []});

    try {
        if (furniture.names.length === 0) {
            throw new Error('You need at least one furniture checked');
        }

        for (const name of furniture.names) {
            name.replace('\n', '').trim();
        }

        const url = 'http://localhost:3030/data/orders';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(furniture)
        });
    } catch (error) {
        alert(error.message);
    }
}

async function onFurnitureCreate(ev) {
    ev.preventDefault();
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
        window.location.pathname = '/06.Furniture/login.html'
    }

    const formData = new FormData(ev.target);
    const furnitureData = {
        name: formData.get('name'),
        price: formData.get('price'),
        factor: formData.get('factor'),
        src: formData.get('img'),
    }

    const tbody = document.querySelector('tbody');
    await createFurniture(furnitureData, userData.token);
    const row = createRow(furnitureData);

    tbody.appendChild(row);
    ev.target.reset();
}

async function createFurniture(furnitureData, token) {
    const url = 'http://localhost:3030/data/furniture';
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(furnitureData)
    });
}

function createRow(info) {
    const tr = document.createElement('tr');
    const imgTd = document.createElement('td');
    const img = document.createElement('img');
    img.src = info.src;
    imgTd.appendChild(img);

    const furnitureNameTd = document.createElement('td');
    const furnitureNameParagraph = document.createElement('p');
    furnitureNameParagraph.textContent = info.name;
    furnitureNameTd.appendChild(furnitureNameParagraph);

    const priceTd = document.createElement('td');
    const priceParagraph = document.createElement('p');
    priceParagraph.textContent = info.price;
    priceTd.appendChild(priceParagraph);

    const factorTd = document.createElement('td');
    const factorParagraph = document.createElement('p');
    factorParagraph.textContent = info.price;
    factorTd.appendChild(factorParagraph);

    const checkboxTd = document.createElement('td');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxTd.appendChild(checkboxInput);

    tr.appendChild(imgTd);
    tr.appendChild(furnitureNameTd);
    tr.appendChild(priceTd);
    tr.appendChild(factorTd);
    tr.appendChild(checkboxTd);

    return tr;
}

async function onRegister(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword = formData.get('rePass');

    const url = 'http://localhost:3030/users/register';
    try {
        if (password !== rePassword) {
            throw new Error('Passwords do not match.');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok !== true) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.pathname = '/06.Furniture/homeLogged.html';
    } catch (error) {
        alert(error.message)
    }
}

async function onLogin(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const url = 'http://localhost:3030/users/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok !== true) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.pathname = '/06.Furniture/homeLogged.html';
    } catch (error) {
        alert(error.message);
    }
}
