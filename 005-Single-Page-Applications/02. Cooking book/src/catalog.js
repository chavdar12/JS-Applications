import { request } from './api.js';
import { el } from './dom.js';

export function setupCatalog(section) {
    return async function showCatalog() {
        section.replaceChildren(el('p', { style: 'color: white' }, 'Loading...'));
        try {
            const recipes = await request('/data/recipes?select=_id%2Cname%2Cimg');
            section.replaceChildren(...recipes.map(createPreview));
        } catch (err) {
            section.replaceChildren(el('p', {}, `Error: ${err.message}`));
        }
    };
}

function createPreview(recipe) {
    const preview = el('article', { className: 'preview' },
        el('div', { className: 'title' }, el('h2', {}, recipe.name)),
        el('div', { className: 'small' }, el('img', { src: recipe.img })));
    preview.addEventListener('click', async () => preview.replaceWith(createDetails(await request(`/data/recipes/${recipe._id}`))));
    return preview;
}

function createDetails(recipe) {
    return el('article', {},
        el('h2', {}, recipe.name),
        el('div', { className: 'band' },
            el('div', { className: 'thumb' }, el('img', { src: recipe.img })),
            el('div', { className: 'ingredients' },
                el('h3', {}, 'Ingredients:'),
                el('ul', {}, ...recipe.ingredients.map((i) => el('li', {}, i))))),
        el('div', { className: 'description' },
            el('h3', {}, 'Preparation:'),
            ...recipe.steps.map((s) => el('p', {}, s))));
}
