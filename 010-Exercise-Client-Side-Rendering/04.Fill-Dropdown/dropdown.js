import { html, render } from 'lit-html';

const URL = 'http://localhost:3030/jsonstore/advanced/dropdown';
const menu = document.getElementById('menu');
const input = document.getElementById('itemText');

document.querySelector('form').addEventListener('submit', addItem);
loadItems();

async function loadItems() {
    const res = await fetch(URL);
    const items = Object.values(await res.json());
    render(items.map((i) => html`<option value=${i._id}>${i.text}</option>`), menu);
}

async function addItem(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
        return;
    }
    await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    input.value = '';
    await loadItems();
}
