import { html, render } from 'lit-html';

const root = document.getElementById('root');
const input = document.getElementById('towns');

const townsTemplate = (towns) => html`<ul>${towns.map((t) => html`<li>${t}</li>`)}</ul>`;

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const towns = input.value.split(',').map((t) => t.trim()).filter(Boolean);
    render(townsTemplate(towns), root);
    input.value = '';
});
