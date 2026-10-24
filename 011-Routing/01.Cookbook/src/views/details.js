import { html, nothing } from 'lit-html';
import { deleteRecipe, getRecipe } from '../api.js';

const detailsTemplate = (recipe, isOwner, onDelete) => html`
<article>
    <h2>${recipe.name}</h2>
    <div class="band">
        <div class="thumb"><img src=${recipe.img}></div>
        <div class="ingredients">
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.map((i) => html`<li>${i}</li>`)}</ul>
        </div>
    </div>
    <div class="description">
        <h3>Preparation:</h3>
        ${recipe.steps.map((s) => html`<p>${s}</p>`)}
    </div>
    ${isOwner ? html`
    <div class="controls">
        <a class="actionLink" href="/edit/${recipe._id}">&#x270e; Edit</a>
        <a class="actionLink" href="javascript:void(0)" @click=${onDelete}>&#x2716; Delete</a>
    </div>` : nothing}
</article>`;

export async function detailsPage(ctx) {
    const recipe = await getRecipe(ctx.params.id);
    ctx.render(detailsTemplate(recipe, ctx.user?.id === recipe._ownerId, onDelete));

    async function onDelete() {
        if (confirm(`Delete ${recipe.name}?`)) {
            await deleteRecipe(recipe._id);
            ctx.page.redirect('/');
        }
    }
}
