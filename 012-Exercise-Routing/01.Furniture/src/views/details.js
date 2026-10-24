import { html, nothing } from 'lit-html';
import { getById, remove } from '../api.js';

const detailsTemplate = (item, isOwner, onDelete) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Furniture Details</h1>
    </div>
</div>
<div class="row space-top">
    <div class="col-md-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <img src=${item.img} />
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <p>Make: <span>${item.make}</span></p>
        <p>Model: <span>${item.model}</span></p>
        <p>Year: <span>${item.year}</span></p>
        <p>Description: <span>${item.description}</span></p>
        <p>Price: <span>${item.price}</span></p>
        <p>Material: <span>${item.material}</span></p>
        ${isOwner ? html`
        <div>
            <a href="/edit/${item._id}" class="btn btn-info">Edit</a>
            <a href="javascript:void(0)" class="btn btn-red" @click=${onDelete}>Delete</a>
        </div>` : nothing}
    </div>
</div>`;

export async function detailsPage(ctx) {
    const item = await getById(ctx.params.id);
    ctx.render(detailsTemplate(item, ctx.user?.id === item._ownerId, onDelete));

    async function onDelete() {
        if (confirm('Are you sure you want to delete this item?')) {
            await remove(item._id);
            ctx.page.redirect('/');
        }
    }
}
