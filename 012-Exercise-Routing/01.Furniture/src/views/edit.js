import { getFurnitureById, updateFurniture } from '../api/data.js';
import { html } from '../lib.js';
import { validateInput } from '../validators.js';

const editTemplate = (furniture, onSubmit) => html`
        <div class="row space-top">
            <div class="col-md-12">
                <h1>Edit Furniture</h1>
                <p>Please fill all fields.</p>
            </div>
        </div>
        <form @submit=${onSubmit}>
            <div class="row space-top">
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label" for="new-make">Make</label>
                        <input class="form-control" id="new-make" type="text" name="make" .value=${furniture.make}>
                    </div>
                    <div class="form-group has-success">
                        <label class="form-control-label" for="new-model">Model</label>
                        <input class="form-control is-valid" id="new-model" type="text" name="model" .value=${furniture.model}>
                    </div>
                    <div class="form-group has-danger">
                        <label class="form-control-label" for="new-year">Year</label>
                        <input class="form-control is-invalid" id="new-year" type="number" name="year" .value=${furniture.year}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-description">Description</label>
                        <input class="form-control" id="new-description" type="text" name="description"
                            .value=${furniture.description}>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="form-control-label" for="new-price">Price</label>
                        <input class="form-control" id="new-price" type="number" name="price" .value=${furniture.price}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-image">Image</label>
                        <input class="form-control" id="new-image" type="text" name="img" .value=${furniture.img}>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="new-material">Material (optional)</label>
                        <input class="form-control" id="new-material" type="text" name="material" .value=${furniture.material}>
                    </div>
                    <input type="submit" class="btn btn-info" value="Edit" />
                </div>
            </div>
        </form>
`;

export async function editPage(ctx) {
    const id = ctx.params.id;
    const furniture = await getFurnitureById(id);

    ctx.render(editTemplate(furniture, onSubmit));

    async function onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const make = formData.get('make').trim();
        const model = formData.get('model').trim();
        const year = Number(formData.get('year').trim());
        const description = formData.get('description').trim();
        const price = Number(formData.get('price').trim());
        const img = formData.get('img').trim();
        const material = formData.get('material').trim();

        const updatedFurniture = {
            make,
            model,
            year,
            description,
            price,
            img,
            material,
        };

        const isValid = validateInput(e.target, updatedFurniture);

        if (isValid) {
            await updateFurniture(id, updatedFurniture);
            e.target.reset();
            ctx.page.redirect('/details/' + id);
        }
    }
}