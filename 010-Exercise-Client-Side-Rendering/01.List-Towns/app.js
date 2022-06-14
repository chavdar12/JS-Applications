import { html, render } from './node_modules/lit-html/lit-html.js';

const townCard = (town) => html`
    <li>${town}</li>
`;

const townsCard = (towns) => html`
    <ul>${towns.map(townCard)}</ul>
`;

const contentFormElement = document.querySelector('form.content');
contentFormElement.addEventListener('submit', loadTowns);

function loadTowns(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    let towns = formData.get('towns').trim();

    if (!towns) {
        return alert('The field is requiered!');
    }

    towns = towns.split(', ').map((x) => x.trim());
    e.target.reset();

    renderResult(towns);
}

function renderResult(towns) {
    const result = townsCard(towns);
    const divRootRarentElement = document.getElementById('root');

    render(result, divRootRarentElement);
}