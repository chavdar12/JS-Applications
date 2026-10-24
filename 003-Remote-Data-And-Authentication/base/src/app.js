const main = document.querySelector('main');
const token = sessionStorage.getItem('accessToken');

document.getElementById('user').style.display = token ? 'inline-block' : 'none';
document.getElementById('guest').style.display = token ? 'none' : 'inline-block';
document.getElementById('logoutBtn').addEventListener('click', logout);

loadRecipes();

async function loadRecipes() {
    try {
        const res = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
        if (!res.ok) {
            throw new Error((await res.json()).message);
        }
        const recipes = await res.json();
        main.replaceChildren(...recipes.map(createPreview));
    } catch (err) {
        main.replaceChildren(el('p', { style: 'color: white' }, `Error: ${err.message}`));
    }
}

function createPreview(recipe) {
    const preview = el('article', { className: 'preview' },
        el('div', { className: 'title' }, el('h2', {}, recipe.name)),
        el('div', { className: 'small' }, el('img', { src: recipe.img })));
    preview.addEventListener('click', () => showDetails(recipe._id, preview));
    return preview;
}

async function showDetails(id, preview) {
    const res = await fetch(`http://localhost:3030/data/recipes/${id}`);
    const recipe = await res.json();

    preview.replaceWith(el('article', {},
        el('h2', {}, recipe.name),
        el('div', { className: 'band' },
            el('div', { className: 'thumb' }, el('img', { src: recipe.img })),
            el('div', { className: 'ingredients' },
                el('h3', {}, 'Ingredients:'),
                el('ul', {}, ...recipe.ingredients.map((i) => el('li', {}, i))))),
        el('div', { className: 'description' },
            el('h3', {}, 'Preparation:'),
            ...recipe.steps.map((s) => el('p', {}, s)))));
}

async function logout() {
    await fetch('http://localhost:3030/users/logout', { headers: { 'X-Authorization': token } });
    sessionStorage.removeItem('accessToken');
    window.location.href = 'index.html';
}

function el(tag, attributes, ...children) {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'style') {
            element.setAttribute('style', value);
        } else {
            element[key] = value;
        }
    }
    element.append(...children);
    return element;
}
