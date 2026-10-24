import { html, render } from 'lit-html';
import { cats } from './catSeeder.js';

const root = document.getElementById('allCats');
const shown = new Set();

const catCard = (cat) => html`
<li>
    <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
    <div class="info">
        <button class="showBtn" @click=${() => toggle(cat.id)}>
            ${shown.has(cat.id) ? 'Hide' : 'Show'} status code
        </button>
        <div class="status" style="display: ${shown.has(cat.id) ? 'block' : 'none'}" id=${cat.id}>
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
        </div>
    </div>
</li>`;

function toggle(id) {
    if (!shown.delete(id)) {
        shown.add(id);
    }
    update();
}

function update() {
    render(html`<ul>${cats.map(catCard)}</ul>`, root);
}

update();
