import { html, nothing } from 'lit-html';
import { deleteIdea, getIdea, getUser } from '../api.js';

const detailsTemplate = (idea, isOwner, onDelete) => html`
<div class="container home some">
    <img class="det-img" src=${idea.img} />
    <div class="desc">
        <h2 class="display-5">${idea.title}</h2>
        <p class="infoType">Description:</p>
        <p class="idea-description">${idea.description}</p>
    </div>
    ${isOwner
        ? html`<div class="text-center"><a class="btn detb" href="javascript:void(0)" @click=${onDelete}>Delete</a></div>`
        : nothing}
</div>`;

export async function detailsPage(ctx) {
    const idea = await getIdea(ctx.params.id);
    const isOwner = getUser()?.id === idea._ownerId;

    ctx.render(detailsTemplate(idea, isOwner, onDelete));

    async function onDelete() {
        if (confirm('Are you sure you want to delete this idea?')) {
            await deleteIdea(idea._id);
            ctx.page.redirect('/dashboard');
        }
    }
}
