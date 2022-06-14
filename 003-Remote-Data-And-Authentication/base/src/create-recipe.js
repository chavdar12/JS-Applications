import { getUserData } from "./utils.js";

const createRecipeUrl = 'http://localhost:3030/data/recipes';

let formElement = document.getElementById('create-recipe');
formElement.addEventListener('submit', createRecipe);

function createRecipe(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const img = formData.get('img').trim();
    const ingredients = formData.get('ingredients').trim().split('\n');
    const steps = formData.get('steps').trim().split('\n');

    if (!name || !img || ingredients.length === 0 || steps.length === 0) {
        return alert('All fields are required!');
    }

    const recipe = {
        name,
        img,
        ingredients,
        steps,
    };

    e.target.reset();

    const userToken = getUserData().accessToken;

    fetch(createRecipeUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(recipe)
    })
        .catch((err) => console.error(err));
}