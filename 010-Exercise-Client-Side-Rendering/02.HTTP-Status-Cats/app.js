import { html, render } from './node_modules/lit-html/lit-html.js';
import { cats } from './catSeeder.js';

const catCard = (cat, onToggle) => html`
    <li>
        <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
        <div class="info">
            <button @click=${onToggle} class="showBtn">Show status code</button>
            <div class="status" style="display: none" id=${cat.id}>
                <h4>Status Code: ${cat.statusCode}</h4>
                <p>${cat.statusMessage}</p>
            </div>
        </div>
    </li>
`;

const catsCard = (cats, onToggle) => html`
    <ul>${cats.map((c) => catCard(c, onToggle))}</ul>
`;

renderCats();

function renderCats() {
    const result = catsCard(cats, onToggle);
    const allCatsSectionElement = document.getElementById('allCats');

    render(result, allCatsSectionElement);
}

function onToggle(e) {
    const targetButton = e.target;
    const hiddenInfoDivElement = targetButton.parentElement.children[1];

    if (targetButton.textContent === 'Show status code') {
        targetButton.textContent = 'Hide status code';
        hiddenInfoDivElement.style.display = 'block';
    } else {
        targetButton.textContent = 'Show status code';
        hiddenInfoDivElement.style.display = 'none';
    }
}
