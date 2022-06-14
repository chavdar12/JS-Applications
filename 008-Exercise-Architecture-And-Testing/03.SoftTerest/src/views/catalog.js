import {getAllIdeas} from '../api/data.js';
import {e} from '../dom.js';

const section = document.getElementById('dashboard-holder');
section.remove();
section.addEventListener('click', onDetails);
let context = null;

export async function showCatalogPage(contextTarget) {
    context = contextTarget;
    context.showSection(section);
    loadIdeas();
}

async function loadIdeas() {
    const ideas = await getAllIdeas();

    if (ideas.length == 0) {
        section.replaceChildren(e('h1', {}, 'No ideas yet! Be the first one :)'))
    } else {
        const fragment = document.createDocumentFragment();
        ideas.map(createIdeaCard).forEach(el => fragment.appendChild(el));
        section.replaceChildren(fragment);
    }
}

function createIdeaCard(idea) {
    const div = e('div', {className: 'card overflow-hidden current-card details'});
    div.style.width = '20rem';
    div.style.height = '18rem';
    div.innerHTML = `
<div class="card-body">
    <p class="card-text">${idea.title}</p>
</div>
<img class="card-image" src="${idea.img}" alt="Card image cap">
<a data-id="${idea._id}" class="btn" href="">Details</a>`;

    return div;
}

function onDetails(ev) {
    if (ev.target.tagName == 'A') {
        const id = ev.target.dataset.id;
        ev.preventDefault();
        context.goTo('details', id);
    }
}
