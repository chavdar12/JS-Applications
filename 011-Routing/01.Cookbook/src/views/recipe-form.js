import { html } from 'lit-html';
import { createRecipe, getRecipe, updateRecipe } from '../api.js';

const formTemplate = (title, recipe, onSubmit) => html`
<article>
    <h2>${title}</h2>
    <form @submit=${onSubmit}>
        <label>Name: <input type="text" name="name" placeholder="Recipe name" .value=${recipe.name ?? ''}></label>
        <label>Image: <input type="text" name="img" placeholder="Image URL" .value=${recipe.img ?? ''}></label>
        <label class="ml">Ingredients: <textarea name="ingredients" placeholder="Enter ingredients on separate lines"
                .value=${(recipe.ingredients ?? []).join('\n')}></textarea></label>
        <label class="ml">Preparation: <textarea name="steps" placeholder="Enter preparation steps on separate lines"
                .value=${(recipe.steps ?? []).join('\n')}></textarea></label>
        <input type="submit" value=${title}>
    </form>
</article>`;

const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

function formPage(title, load, save) {
    return async (ctx) => {
        ctx.render(formTemplate(title, await load(ctx), onSubmit));

        async function onSubmit(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            const recipe = { name: data.name.trim(), img: data.img.trim(), ingredients: lines(data.ingredients), steps: lines(data.steps) };
            if (!recipe.name || !recipe.img || !recipe.ingredients.length || !recipe.steps.length) {
                alert('All fields are required!');
                return;
            }
            try {
                const saved = await save(ctx, recipe);
                ctx.page.redirect(`/details/${saved._id}`);
            } catch (err) {
                alert(err.message);
            }
        }
    };
}

export const createPage = formPage('Create Recipe', () => ({}), (ctx, recipe) => createRecipe(recipe));
export const editPage = formPage('Edit Recipe', (ctx) => getRecipe(ctx.params.id), (ctx, recipe) => updateRecipe(ctx.params.id, recipe));
