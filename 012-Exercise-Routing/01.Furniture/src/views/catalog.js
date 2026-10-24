import { html } from 'lit-html';
import { getAll, getMine } from '../api.js';

const itemCard = (item) => html`
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=${item.img} />
            <p>${item.description}</p>
            <footer>
                <p>Price: <span>${item.price} $</span></p>
            </footer>
            <div>
                <a href="/details/${item._id}" class="btn btn-info">Details</a>
            </div>
        </div>
    </div>
</div>`;

const catalogTemplate = (title, subtitle, items) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>${title}</h1>
        <p>${subtitle}</p>
    </div>
</div>
<div class="row space-top">
    ${items.map(itemCard)}
</div>`;

export async function catalogPage(ctx) {
    ctx.render(catalogTemplate('Welcome to Furniture System', 'Select furniture from the catalog to view details.', await getAll()));
}

export async function myFurniturePage(ctx) {
    ctx.render(catalogTemplate('My Furniture', 'This is a list of your publications.', await getMine(ctx.user.id)));
}
