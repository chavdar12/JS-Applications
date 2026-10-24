import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { click as userClick, loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

// page.js is a singleton bound to one window, so the whole file walks through one session.
const table = { _id: 't1', _ownerId: 'u1', make: 'Table', model: 'Swedish', year: 2015, description: 'Medium table', price: 235, img: '/images/table.png', material: 'Wood' };
const sofa = { ...table, _id: 's1', _ownerId: 'u2', make: 'Sofa', description: 'Comfy sofa!', price: 1200 };
let catalog = [table, sofa];
const fetch = mockFetch({
    'GET /data/catalog': () => catalog,
    'GET /data/catalog?where=_ownerId%3D%22u1%22': () => catalog.filter((i) => i._ownerId === 'u1'),
    'GET /data/catalog/t1': () => catalog.find((i) => i._id === 't1'),
    'GET /data/catalog/s1': sofa,
    'POST /data/catalog': (body) => {
        const item = { ...body, _id: 'n1', _ownerId: 'u1' };
        catalog = [...catalog, item];
        return item;
    },
    'GET /data/catalog/n1': () => catalog.find((i) => i._id === 'n1'),
    'PUT /data/catalog/t1': (body) => {
        catalog = catalog.map((i) => (i._id === 't1' ? { ...i, ...body } : i));
        return catalog[0];
    },
    'DELETE /data/catalog/t1': () => {
        catalog = catalog.filter((i) => i._id !== 't1');
        return {};
    },
    'POST /users/login': (body) => (body.password === '123'
        ? { email: body.email, _id: 'u1', accessToken: 'tok' }
        : reply(403, { message: 'Login or password don\'t match' })),
    'GET /users/logout': reply(204)
});
let ctx;

const $ = (selector) => ctx.document.querySelector(selector);
const go = async (selector) => {
    userClick($(selector));
    await settle();
};
const path = () => ctx.window.location.pathname;
const cards = () => [...ctx.document.querySelectorAll('.card-body > p')].map((p) => p.textContent);

before(async () => {
    ctx = await loadPage(new URL('./index.html', import.meta.url), { fetch });
});

test('validate checks the course rules', async () => {
    // imported after loadPage: lit-html needs the DOM globals at import time
    const { validate } = await import('./src/views/form.js');
    assert.deepEqual(validate(table), []);
    assert.deepEqual(validate({ make: 'Abc', model: 'Swedish', year: 1949, description: 'short', price: 0, img: '' }),
        ['make', 'year', 'description', 'price', 'img']);
});

test('guest sees the catalog and guest navigation', () => {
    assert.equal(path(), '/');
    assert.deepEqual(cards(), ['Medium table', 'Comfy sofa!']);
    assert.equal($('#guest').style.display, 'inline-block');
    assert.equal($('#user').style.display, 'none');
    assert.ok($('#catalogLink').classList.contains('active'));
});

test('guest details have no owner actions', async () => {
    await go('a[href="/details/s1"]');
    assert.equal(path(), '/details/s1');
    assert.equal(ctx.document.querySelectorAll('.container p span')[0].textContent, 'Sofa');
    assert.equal($('.btn-red'), null);
});

test('login alerts on bad credentials, then logs in', async () => {
    await go('#loginLink');
    submit($('.container form'), { email: 'peter@abv.bg', password: 'bad' });
    await settle();
    assert.deepEqual(ctx.alerts, ['Login or password don\'t match']);

    submit($('.container form'), { password: '123' });
    await settle();
    assert.equal(path(), '/');
    assert.equal($('#user').style.display, 'inline-block');
});

test('create marks invalid fields, then saves and opens details', async () => {
    await go('#createLink');
    const form = () => $('.container form');
    submit(form(), { make: 'Ch', model: 'Model', year: '2020', description: 'A nice chair', price: '55', img: '/images/chair.jpg' });
    await settle();
    assert.ok($('#new-make').classList.contains('is-invalid'));
    assert.ok($('#new-model').classList.contains('is-valid'));
    assert.equal(fetch.calls.filter((c) => c.method === 'POST' && c.path === '/data/catalog').length, 0);

    submit(form(), { make: 'Chair' });
    await settle();
    const post = fetch.calls.find((c) => c.method === 'POST' && c.path === '/data/catalog');
    assert.equal(post.headers['x-authorization'], 'tok');
    assert.equal(post.body.year, 2020);
    assert.equal(path(), '/details/n1');
});

test('my furniture lists only own items', async () => {
    await go('#profileLink');
    assert.deepEqual(cards(), ['Medium table', 'A nice chair']);
});

test('owner edits and deletes an item', async () => {
    await go('a[href="/details/t1"]');
    await go('a[href="/edit/t1"]');
    assert.equal($('#new-make').value, 'Table');
    submit($('.container form'), { price: '300' });
    await settle();
    assert.equal(fetch.calls.find((c) => c.method === 'PUT').body.price, 300);
    assert.equal(path(), '/details/t1');

    userClick($('.btn-red'));
    await settle();
    assert.equal(path(), '/');
    assert.deepEqual(cards(), ['Comfy sofa!', 'A nice chair']);
});

test('logout returns to guest mode', async () => {
    $('#logoutBtn').click();
    await settle();
    assert.equal(ctx.window.sessionStorage.getItem('userData'), null);
    assert.equal($('#guest').style.display, 'inline-block');
});
