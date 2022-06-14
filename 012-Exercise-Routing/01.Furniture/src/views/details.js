import { deleteById, getFurnitureById } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const detailsTemplate = (furniture, isCreator, onDelete) => html`
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Furniture Details</h1>
            </div>
        </div>
        <div class="row space-top">
            <div class="col-md-4">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <img src=${furniture.img} />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <p>Make: <span>${furniture.make}</span></p>
                <p>Model: <span>${furniture.model}</span></p>
                <p>Year: <span>${furniture.year}</span></p>
                <p>Description: <span>${furniture.description}</span></p>
                <p>Price: <span>${furniture.price}</span></p>
                <p>Material: <span>${furniture.material ? furniture.material : ''}</span></p>
                ${isCreator
                  ? html`
                        <div>
                            <a href="/edit/${furniture._id}" class="btn btn-info">Edit</a>
                            <a @click=${onDelete} href="javascript:void(0)" class="btn btn-red">Delete</a>
                        </div>`
                : null
                }
            </div>
        </div>
`;

export async function detailsPage(ctx) {
    const id = ctx.params.id;
    const furniture = await getFurnitureById(id);

    const user = getUserData();
    const isCreator = user && user.id === furniture._ownerId;

    ctx.render(detailsTemplate(furniture, isCreator, onDelete));

    async function onDelete(){
        const confirmation = confirm('Are you sure?');

        if(confirmation){
            await deleteById(id);
            ctx.page.redirect('/');
        }
    }
}