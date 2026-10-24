import { html, render } from 'lit-html';
import { towns } from './towns.js';

const townsRoot = document.getElementById('towns');
const result = document.getElementById('result');
const input = document.getElementById('searchText');

const townsTemplate = (match) => html`
<ul>
    ${towns.map((t) => html`<li class=${match && t.includes(match) ? 'active' : ''}>${t}</li>`)}
</ul>`;

render(townsTemplate(''), townsRoot);
document.querySelector('button').addEventListener('click', search);

function search() {
    const match = input.value;
    render(townsTemplate(match), townsRoot);
    result.textContent = `${match ? towns.filter((t) => t.includes(match)).length : 0} matches found`;
}
