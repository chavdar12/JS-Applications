import { html } from 'lit-html';
import { getRecipes } from '../api.js';

const previewTemplate = (recipe) => html`
<a class="card" href="/details/${recipe._id}">
    <article class="preview">
        <div class="title">
            <h2>${recipe.name}</h2>
        </div>
        <div class="small"><img src=${recipe.img}></div>
    </article>
</a>`;

export async function catalogPage(ctx) {
    const recipes = await getRecipes();
    ctx.render(recipes.length ? recipes.map(previewTemplate) : html`<p style="color: white">No recipes yet.</p>`);
}
