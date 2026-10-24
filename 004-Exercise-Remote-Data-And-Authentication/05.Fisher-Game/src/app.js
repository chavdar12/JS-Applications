import { BASE_URL, getUser, initNav } from './nav.js';

const FIELDS = ['angler', 'weight', 'species', 'location', 'bait', 'captureTime'];
const catchesDiv = document.getElementById('catches');
const addForm = document.getElementById('addForm');
const addBtn = addForm.querySelector('.add');

catchesDiv.replaceChildren();
initNav(() => {
    addBtn.disabled = true;
    catchesDiv.replaceChildren();
});
addBtn.disabled = !getUser();

document.querySelector('.load').addEventListener('click', loadCatches);
addForm.addEventListener('submit', onAdd);
catchesDiv.addEventListener('click', onCatchAction);

async function request(url, method = 'GET', body) {
    const options = { method, headers: {} };
    const user = getUser();
    if (user) {
        options.headers['X-Authorization'] = user.token;
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error((await res.json()).message);
    }
    return res.status === 204 ? null : res.json();
}

function toCatch(values) {
    if (FIELDS.some((f) => String(values[f] ?? '').trim() === '')) {
        throw new Error('All fields are required!');
    }
    return { ...values, weight: Number(values.weight), captureTime: Number(values.captureTime) };
}

async function loadCatches() {
    const catches = await request(`${BASE_URL}/data/catches`);
    const user = getUser();
    catchesDiv.replaceChildren(...catches.map((c) => createCatch(c, user?.id === c._ownerId)));
}

function createCatch(data, isOwner) {
    const div = document.createElement('div');
    div.className = 'catch';
    for (const field of FIELDS) {
        const label = document.createElement('label');
        label.textContent = field === 'captureTime' ? 'Capture Time' : field[0].toUpperCase() + field.slice(1);
        const input = document.createElement('input');
        input.type = field === 'captureTime' ? 'number' : 'text';
        input.className = field;
        input.value = data[field];
        input.disabled = !isOwner;
        div.append(label, input);
    }
    for (const action of ['update', 'delete']) {
        const btn = document.createElement('button');
        btn.className = action;
        btn.dataset.id = data._id;
        btn.textContent = action[0].toUpperCase() + action.slice(1);
        btn.disabled = !isOwner;
        div.appendChild(btn);
    }
    return div;
}

async function onAdd(e) {
    e.preventDefault();
    try {
        await request(`${BASE_URL}/data/catches`, 'POST', toCatch(Object.fromEntries(new FormData(addForm))));
        addForm.reset();
        await loadCatches();
    } catch (err) {
        alert(err.message);
    }
}

async function onCatchAction(e) {
    const id = e.target.dataset.id;
    if (!id) {
        return;
    }
    const div = e.target.closest('.catch');
    try {
        if (e.target.classList.contains('delete')) {
            await request(`${BASE_URL}/data/catches/${id}`, 'DELETE');
            div.remove();
        } else if (e.target.classList.contains('update')) {
            const values = Object.fromEntries(FIELDS.map((f) => [f, div.querySelector(`.${f}`).value]));
            await request(`${BASE_URL}/data/catches/${id}`, 'PUT', toCatch(values));
        }
    } catch (err) {
        alert(err.message);
    }
}
