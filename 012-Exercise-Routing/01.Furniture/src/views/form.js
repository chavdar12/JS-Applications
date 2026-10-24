import { html } from 'lit-html';
import { create, getById, update } from '../api.js';

const RULES = {
    make: (v) => v.length >= 4,
    model: (v) => v.length >= 4,
    year: (v) => Number(v) >= 1950 && Number(v) <= 2050,
    description: (v) => v.length > 10,
    price: (v) => Number(v) > 0,
    img: (v) => v.length > 0,
    material: () => true
};

/** Returns the names of the invalid fields (empty when the item is valid). */
export function validate(item) {
    return Object.keys(RULES).filter((field) => !RULES[field](String(item[field] ?? '').trim()));
}

const field = (name, label, type, item, errors) => html`
<div class="form-group">
    <label class="form-control-label" for="new-${name}">${label}</label>
    <input class="form-control ${errors ? (errors.includes(name) ? 'is-invalid' : 'is-valid') : ''}"
        id="new-${name}" type=${type} name=${name} .value=${item[name] ?? ''}>
</div>`;

const formTemplate = (title, submitLabel, item, errors, onSubmit) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>${title}</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            ${field('make', 'Make', 'text', item, errors)}
            ${field('model', 'Model', 'text', item, errors)}
            ${field('year', 'Year', 'number', item, errors)}
            ${field('description', 'Description', 'text', item, errors)}
        </div>
        <div class="col-md-4">
            ${field('price', 'Price', 'number', item, errors)}
            ${field('img', 'Image', 'text', item, errors)}
            ${field('material', 'Material (optional)', 'text', item, errors)}
            <input type="submit" class="btn btn-primary" value=${submitLabel} />
        </div>
    </div>
</form>`;

function formPage(title, submitLabel, load, save) {
    return async (ctx) => {
        const item = await load(ctx);
        draw(item, null);

        function draw(values, errors) {
            ctx.render(formTemplate(title, submitLabel, values, errors, onSubmit));
        }

        async function onSubmit(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            const errors = validate(data);
            if (errors.length) {
                draw(data, errors);
                return;
            }
            const saved = await save(ctx, { ...data, year: Number(data.year), price: Number(data.price) });
            ctx.page.redirect(`/details/${saved._id}`);
        }
    };
}

export const createPage = formPage('Create New Furniture', 'Create', () => ({}), (ctx, item) => create(item));
export const editPage = formPage('Edit Furniture', 'Edit', (ctx) => getById(ctx.params.id), (ctx, item) => update(ctx.params.id, item));
