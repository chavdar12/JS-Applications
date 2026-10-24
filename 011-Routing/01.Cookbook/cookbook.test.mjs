import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { click as userClick, loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

// page.js is a singleton bound to one window, so the whole file walks through one session.
const lasagna = { _id: 'r1', _ownerId: 'u1', name: 'Easy Lasagna', img: 'assets/lasagna.jpg', ingredients: ['pasta', 'cheese'], steps: ['bake'] };
const trout = { _id: 'r2', _ownerId: 'u2', name: 'Roast Trout', img: 'assets/fish.jpg', ingredients: ['trout'], steps: ['roast'] };
let recipes = [lasagna, trout];
const byId = (id) => () => recipes.find((r) => r._id === id);
const fetch = mockFetch({
    'GET /data/recipes?select=_id%2Cname%2Cimg': () => recipes.map(({ _id, name, img }) => ({ _id, name, img })),
    'GET /data/recipes/r1': byId('r1'),
    'GET /data/recipes/r2': byId('r2'),
    'GET /data/recipes/r3': byId('r3'),
    'POST /data/recipes': (body) => {
        recipes = [...recipes, { ...body, _id: 'r3', _ownerId: 'u1' }];
        return recipes.at(-1);
    },
    'PUT /data/recipes/r1': (body) => {
        recipes = recipes.map((r) => (r._id === 'r1' ? { ...r, ...body } : r));
        return byId('r1')();
    },
    'DELETE /data/recipes/r1': () => {
        recipes = recipes.filter((r) => r._id !== 'r1');
        return {};
    },
    'POST /users/register': reply(409, { message: 'A user with the same email already exists' }),
    'POST /users/login': { email: 'peter@abv.bg', _id: 'u1', accessToken: 'tok' },
    'GET /users/logout': reply(204)
});
let ctx;

const $ = (selector) => ctx.document.querySelector(selector);
const go = async (selector) => {
    userClick($(selector));
    await settle();
};
const path = () => ctx.window.location.pathname;
const names = () => [...ctx.document.querySelectorAll('.preview h2')].map((h) => h.textContent);

before(async () => {
    ctx = await loadPage(new URL('./index.html', import.meta.url), { fetch });
});

test('catalog route lists recipes as links to details', () => {
    assert.equal(path(), '/');
    assert.deepEqual(names(), ['Easy Lasagna', 'Roast Trout']);
    assert.equal($('#guest').style.display, 'inline-block');
});

test('details route renders the recipe without owner controls for guests', async () => {
    await go('a[href="/details/r2"]');
    assert.equal(path(), '/details/r2');
    assert.equal($('main h2').textContent, 'Roast Trout');
    assert.equal($('.controls'), null);
});

test('register shows errors, login signs in', async () => {
    await go('a[href="/register"]');
    submit($('main form'), { email: 'peter@abv.bg', password: '1', rePass: '2' });
    submit($('main form'), { rePass: '1' });
    await settle();
    assert.deepEqual(ctx.alerts, ['Passwords don\'t match!', 'A user with the same email already exists']);

    await go('a[href="/login"]');
    submit($('main form'), { email: 'peter@abv.bg', password: '1' });
    await settle();
    assert.equal(path(), '/');
    assert.equal($('#user').style.display, 'inline-block');
});

test('create route posts a recipe and redirects to its details', async () => {
    await go('a[href="/create"]');
    assert.ok($('a[href="/create"]').classList.contains('active'));
    submit($('main form'), { name: 'Soup', img: 'soup.jpg', ingredients: 'water\nsalt', steps: 'boil' });
    await settle();

    const post = fetch.calls.find((c) => c.method === 'POST' && c.path === '/data/recipes');
    assert.equal(post.headers['x-authorization'], 'tok');
    assert.deepEqual(post.body, { name: 'Soup', img: 'soup.jpg', ingredients: ['water', 'salt'], steps: ['boil'] });
    assert.equal(path(), '/details/r3');
});

test('owner edits and deletes a recipe', async () => {
    ctx.window.history.pushState(null, '', '/details/r1');
    await go('a[href="/"]');
    await go('a[href="/details/r1"]');
    await go('a[href="/edit/r1"]');
    assert.equal($('textarea[name="ingredients"]').value, 'pasta\ncheese');
    submit($('main form'), { name: 'Lasagna Deluxe' });
    await settle();
    assert.equal(path(), '/details/r1');
    assert.equal($('main h2').textContent, 'Lasagna Deluxe');

    userClick([...ctx.document.querySelectorAll('.controls a')].at(-1));
    await settle();
    assert.equal(path(), '/');
    assert.deepEqual(names(), ['Roast Trout', 'Soup']);
});

test('logout returns to guest mode', async () => {
    $('#logoutBtn').click();
    await settle();
    assert.equal(ctx.window.sessionStorage.getItem('userData'), null);
    assert.equal($('#guest').style.display, 'inline-block');
});
