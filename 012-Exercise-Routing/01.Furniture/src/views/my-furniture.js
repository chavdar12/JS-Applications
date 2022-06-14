import { getUserFurniture } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const myFurnitureTemplate = (furnitures) => html`
        <div class="row space-top">
            <div class="col-md-12">
                <h1>My Furniture</h1>
                <p>This is a list of your publications.</p>
            </div>
        </div>
        <div class="row space-top">
        
            ${furnitures.length === 0
          ? html`<p>No furniture yet!</p>`
          : furnitures.map(furnitureCard)
        }
        
        </div>
`;

const furnitureCard = (furniture) => html`
    <div class="col-md-4">
        <div class="card text-white bg-primary">
            <div class="card-body">
                <img src=${furniture.img} />
                <p>${furniture.description}</p>
                <footer>
                    <p>Price: <span>${furniture.price} $</span></p>
                </footer>
                <div>
                    <a href="/details/${furniture._id}" class="btn btn-info">Details</a>
                </div>
            </div>
        </div>
    </div>
`;

export async function myFurniturePage(ctx) {
    const user = getUserData();
    const furnitures = await getUserFurniture(user.id);

    ctx.render(myFurnitureTemplate(furnitures));
}