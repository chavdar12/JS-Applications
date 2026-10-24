import { html } from 'lit-html';
import { getIdeas } from '../api.js';

const ideaCard = (idea) => html`
<div class="card overflow-hidden current-card details" style="width: 20rem; height: 18rem;">
    <div class="card-body">
        <p class="card-text">${idea.title}</p>
    </div>
    <img class="card-image" src=${idea.img} alt="Card image cap">
    <a class="btn" href="/details/${idea._id}">Details</a>
</div>`;

const dashboardTemplate = (ideas) => html`
<div id="dashboard-holder">
    ${ideas.length ? ideas.map(ideaCard) : html`<h1>No ideas yet! Be the first one :)</h1>`}
</div>`;

export async function dashboardPage(ctx) {
    ctx.render(dashboardTemplate(await getIdeas()));
}
