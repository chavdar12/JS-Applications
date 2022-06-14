import { deleteById, getIdeaById } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const detailsTemplate = (idea, isCreator, onDelete) => html`
    <div class="container home some">
        <img class="det-img" src="${idea.img}" />
        <div class="desc">
            <h2 class="display-5">${idea.title}</h2>
            <p class="infoType">Description:</p>
            <p class="idea-description">${idea.description}</p>
        </div>
        
        ${isCreator
        ? html`
                <div class="text-center">
                    <a @click=${onDelete} class="btn detb" href="javascript:void(0)">Delete</a>
                </div>`
        : null
    }
        
    </div>`;

export async function detailsPage(ctx) {
    const id = ctx.params.id;
    const idea = await getIdeaById(id);

    const user = getUserData();
    const isCreator = user && user.id === idea._ownerId;

    ctx.render(detailsTemplate(idea, isCreator, onDelete));

    async function onDelete() {
        const confirmation = confirm('Are you sure?');

        if (confirmation) {
            await deleteById(id);
            ctx.page.redirect('/dashboard');
        }
    }
}