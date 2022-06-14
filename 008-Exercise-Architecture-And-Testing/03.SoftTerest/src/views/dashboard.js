import { getAllIdeas } from '../api/data.js';
import { html } from '../lib.js';

const dashboardTemplate = (ideas) => html`
    <div id="dashboard-holder">
    
        ${ideas.length> 0
          ? ideas.map(ideaCard)
          : html`<h1>No ideas yet! Be the first one :)</h1>`
        }
        
    </div>`;

const ideaCard = (idea) => html`
        <div class="card overflow-hidden current-card details" style="width: 20rem; height: 18rem;">
            <div class="card-body">
                <p class="card-text">${idea.title}</p>
            </div>
            <img class="card-image" src="${idea.img}" alt="Card image cap">
            <a class="btn" href="/details/${idea._id}">Details</a>
        </div>`;

export async function dashboardPage(ctx) {
    const ideas = await getAllIdeas();
    ctx.render(dashboardTemplate(ideas));
}