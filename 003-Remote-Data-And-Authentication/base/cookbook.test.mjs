import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

const page = (name) => new URL(`./${name}`, import.meta.url);
const recipe = {
    _id: '01', name: 'Easy Lasagna', img: 'assets/lasagna.jpg',
    ingredients: ['1 tbsp Ingredient 1', '2 cups Ingredient 2'], steps: ['Prepare', 'Cook']
};

test('catalog lists recipes and expands details on click', async () => {
    const fetch = mockFetch({
        'GET /data/recipes?select=_id%2Cname%2Cimg': [{ _id: '01', name: 'Easy Lasagna', img: 'assets/lasagna.jpg' }],
        'GET /data/recipes/01': recipe
    });
    const { document } = await loadPage(page('index.html'), { fetch });

    const preview = document.querySelector('article.preview');
    assert.equal(preview.querySelector('h2').textContent, 'Easy Lasagna');

    preview.click();
    await settle();

    assert.equal(document.querySelector('article.preview'), null);
    assert.deepEqual([...document.querySelectorAll('.ingredients li')].map((li) => li.textContent), recipe.ingredients);
    assert.deepEqual([...document.querySelectorAll('.description p')].map((p) => p.textContent), recipe.steps);
});

test('catalog shows guest or user navigation', async () => {
    const guest = await loadPage(page('index.html'), { fetch: mockFetch({ 'GET /data/recipes?select=_id%2Cname%2Cimg': [] }) });
    assert.equal(guest.document.getElementById('user').style.display, 'none');
    assert.equal(guest.document.getElementById('guest').style.display, 'inline-block');

    const user = await loadPage(page('index.html'), {
        fetch: mockFetch({ 'GET /data/recipes?select=_id%2Cname%2Cimg': [] }),
        session: { accessToken: 'abc' }
    });
    assert.equal(user.document.getElementById('user').style.display, 'inline-block');
    assert.equal(user.document.getElementById('guest').style.display, 'none');
});

test('logout calls the server with the token and clears the session', async () => {
    const fetch = mockFetch({ 'GET /data/recipes?select=_id%2Cname%2Cimg': [], 'GET /users/logout': reply(204) });
    const { document, window } = await loadPage(page('index.html'), { fetch, session: { accessToken: 'abc' } });

    document.getElementById('logoutBtn').click();
    await settle();

    assert.equal(fetch.calls.at(-1).headers['x-authorization'], 'abc');
    assert.equal(window.sessionStorage.getItem('accessToken'), null);
});

test('login stores the access token', async () => {
    const fetch = mockFetch({ 'POST /users/login': { _id: 'u1', email: 'peter@abv.bg', accessToken: 'tok' } });
    const { document, window } = await loadPage(page('login.html'), { fetch });

    submit(document.getElementById('login-form'), { email: 'peter@abv.bg', password: '123456' });
    await settle();

    assert.deepEqual(fetch.calls[0].body, { email: 'peter@abv.bg', password: '123456' });
    assert.equal(window.sessionStorage.getItem('accessToken'), 'tok');
});

test('login alerts the server error', async () => {
    const fetch = mockFetch({ 'POST /users/login': reply(403, { message: 'Login or password don\'t match' }) });
    const { document, window, alerts } = await loadPage(page('login.html'), { fetch });

    submit(document.getElementById('login-form'), { email: 'x@x.bg', password: 'bad' });
    await settle();

    assert.deepEqual(alerts, ['Login or password don\'t match']);
    assert.equal(window.sessionStorage.getItem('accessToken'), null);
});

test('register rejects mismatched passwords without calling the server', async () => {
    const fetch = mockFetch({});
    const { document, alerts } = await loadPage(page('register.html'), { fetch });

    submit(document.getElementById('register-form'), { email: 'a@a.bg', password: '1', rePass: '2' });
    await settle();

    assert.equal(fetch.calls.length, 0);
    assert.equal(alerts.length, 1);
});

test('register stores the access token', async () => {
    const fetch = mockFetch({ 'POST /users/register': { _id: 'u2', email: 'a@a.bg', accessToken: 'new' } });
    const { document, window } = await loadPage(page('register.html'), { fetch });

    submit(document.getElementById('register-form'), { email: 'a@a.bg', password: '1', rePass: '1' });
    await settle();

    assert.equal(window.sessionStorage.getItem('accessToken'), 'new');
});

test('create posts the recipe with ingredients and steps split by lines', async () => {
    const fetch = mockFetch({ 'POST /data/recipes': (body) => ({ ...body, _id: 'new' }) });
    const { document } = await loadPage(page('create.html'), { fetch, session: { accessToken: 'abc' } });

    submit(document.getElementById('create-recipe'), {
        name: 'Soup', img: 'soup.jpg', ingredients: 'water\n\nsalt\n', steps: 'boil\nserve'
    });
    await settle();

    const [call] = fetch.calls;
    assert.equal(call.headers['x-authorization'], 'abc');
    assert.deepEqual(call.body, { name: 'Soup', img: 'soup.jpg', ingredients: ['water', 'salt'], steps: ['boil', 'serve'] });
});
