import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const LIST = 'GET /data/recipes?select=_id%2Cname%2Cimg';
const recipe = { _id: '01', name: 'Easy Lasagna', img: 'assets/lasagna.jpg', ingredients: ['pasta'], steps: ['bake'] };

const nav = (document, view) => document.querySelector(`[data-view="${view}"]`).click();

test('opens on the catalog and expands a recipe', async () => {
    const fetch = mockFetch({ [LIST]: [recipe], 'GET /data/recipes/01': recipe });
    const { document } = await loadPage(page, { fetch });

    assert.equal(document.querySelectorAll('main > section').length, 1);
    assert.equal(document.querySelector('main #catalog-view .preview h2').textContent, 'Easy Lasagna');
    assert.equal(document.getElementById('guest').style.display, 'inline-block');

    document.querySelector('.preview').click();
    await settle();
    assert.equal(document.querySelector('.ingredients li').textContent, 'pasta');
});

test('nav switches views without reloading the page', async () => {
    const { document } = await loadPage(page, { fetch: mockFetch({ [LIST]: [] }) });

    nav(document, 'login');
    assert.equal(document.querySelector('main > section').id, 'login-view');
    assert.ok(document.querySelector('[data-view="login"]').classList.contains('active'));

    nav(document, 'register');
    assert.equal(document.querySelector('main > section').id, 'register-view');
    assert.equal(document.getElementById('login-view'), null);
});

test('login stores the token, shows user nav and returns to catalog', async () => {
    const fetch = mockFetch({ [LIST]: [], 'POST /users/login': { accessToken: 'tok', email: 'a@a.bg', _id: 'u1' } });
    const { document, window } = await loadPage(page, { fetch });

    nav(document, 'login');
    submit(document.querySelector('#login-view form'), { email: 'a@a.bg', password: '123' });
    await settle();

    assert.equal(window.sessionStorage.getItem('accessToken'), 'tok');
    assert.equal(document.getElementById('user').style.display, 'inline-block');
    assert.equal(document.querySelector('main > section').id, 'catalog-view');
});

test('register checks passwords; server errors alert', async () => {
    const fetch = mockFetch({ [LIST]: [], 'POST /users/register': reply(409, { message: 'A user with the same email already exists' }) });
    const { document, alerts } = await loadPage(page, { fetch });

    nav(document, 'register');
    const form = document.querySelector('#register-view form');
    submit(form, { email: 'a@a.bg', password: '1', rePass: '2' });
    submit(form, { rePass: '1' });
    await settle();

    assert.deepEqual(alerts, ['Passwords don\'t match!', 'A user with the same email already exists']);
});

test('create posts the recipe with the token, logout clears it', async () => {
    const fetch = mockFetch({ [LIST]: [], 'POST /data/recipes': (b) => b, 'GET /users/logout': reply(204) });
    const { document, window } = await loadPage(page, { fetch, session: { accessToken: 'tok' } });

    nav(document, 'create');
    submit(document.querySelector('#create-view form'), { name: 'Soup', img: 's.jpg', ingredients: 'a\nb', steps: 'c' });
    await settle();
    const post = fetch.calls.find((c) => c.method === 'POST');
    assert.equal(post.headers['x-authorization'], 'tok');
    assert.deepEqual(post.body, { name: 'Soup', img: 's.jpg', ingredients: ['a', 'b'], steps: ['c'] });
    assert.equal(document.querySelector('main > section').id, 'catalog-view');

    document.getElementById('logoutBtn').click();
    await settle();
    assert.equal(window.sessionStorage.getItem('accessToken'), null);
    assert.equal(document.getElementById('guest').style.display, 'inline-block');
});
