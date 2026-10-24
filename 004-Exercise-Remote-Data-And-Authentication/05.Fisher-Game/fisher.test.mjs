import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

const root = new URL('./', import.meta.url);
const page = (name) => new URL(`./src/${name}`, import.meta.url);
const user = { email: 'peter@abv.bg', id: 'u1', token: 'tok' };
const storage = { userData: JSON.stringify(user) };
const mine = { _id: 'c1', _ownerId: 'u1', angler: 'Paulo', weight: 636, species: 'Marlin', location: 'Brazil', bait: 'pink', captureTime: 80 };
const theirs = { ...mine, _id: 'c2', _ownerId: 'u2', angler: 'John' };

async function loadCatches(options) {
    const ctx = await loadPage(page('index.html'), { ...options, root });
    ctx.document.querySelector('.load').click();
    await settle();
    return ctx;
}

test('guest sees guest nav, disabled Add and no placeholder catches', async () => {
    const { document } = await loadPage(page('index.html'), { root });

    assert.equal(document.getElementById('user').style.display, 'none');
    assert.equal(document.getElementById('guest').style.display, 'inline-block');
    assert.equal(document.querySelector('.add').disabled, true);
    assert.equal(document.querySelectorAll('#catches .catch').length, 0);
});

test('load renders catches; only the owner can edit', async () => {
    const fetch = mockFetch({ 'GET /data/catches': [mine, theirs] });
    const { document } = await loadCatches({ fetch, storage });

    assert.equal(document.querySelector('nav .email span').textContent, 'peter@abv.bg');
    assert.equal(document.querySelector('.add').disabled, false);
    const [own, other] = document.querySelectorAll('#catches .catch');
    assert.equal(own.querySelector('.angler').value, 'Paulo');
    assert.equal(own.querySelector('.update').disabled, false);
    assert.equal(other.querySelector('.angler').disabled, true);
    assert.equal(other.querySelector('.delete').disabled, true);
});

test('add posts a catch with numeric fields and reloads', async () => {
    const fetch = mockFetch({ 'GET /data/catches': [], 'POST /data/catches': (body) => ({ ...body, _id: 'c3' }) });
    const { document, alerts } = await loadPage(page('index.html'), { fetch, storage, root });

    submit(document.getElementById('addForm'), {
        angler: 'Ivan', weight: '10', species: 'Carp', location: 'Iskar', bait: 'corn', captureTime: '15'
    });
    await settle();

    const post = fetch.calls.find((c) => c.method === 'POST');
    assert.equal(post.headers['x-authorization'], 'tok');
    assert.deepEqual(post.body, { angler: 'Ivan', weight: 10, species: 'Carp', location: 'Iskar', bait: 'corn', captureTime: 15 });
    assert.deepEqual(alerts, []);
});

test('add with empty fields alerts and does not post', async () => {
    const fetch = mockFetch({});
    const { document, alerts } = await loadPage(page('index.html'), { fetch, storage, root });

    submit(document.getElementById('addForm'), { angler: 'Ivan' });
    await settle();

    assert.equal(fetch.calls.length, 0);
    assert.equal(alerts.length, 1);
});

test('update sends edited values, delete removes the catch', async () => {
    const fetch = mockFetch({
        'GET /data/catches': [mine],
        'PUT /data/catches/c1': (body) => body,
        'DELETE /data/catches/c1': {}
    });
    const { document } = await loadCatches({ fetch, storage });
    const card = document.querySelector('.catch');

    card.querySelector('.weight').value = '700';
    card.querySelector('.update').click();
    await settle();
    assert.equal(fetch.calls.find((c) => c.method === 'PUT').body.weight, 700);

    card.querySelector('.delete').click();
    await settle();
    assert.equal(document.querySelectorAll('.catch').length, 0);
});

test('logout clears the session and returns to guest mode', async () => {
    const fetch = mockFetch({ 'GET /users/logout': reply(204) });
    const { document, window } = await loadPage(page('index.html'), { fetch, storage, root });

    document.getElementById('logout').click();
    await settle();

    assert.equal(window.localStorage.getItem('userData'), null);
    assert.equal(document.getElementById('guest').style.display, 'inline-block');
    assert.equal(document.querySelector('.add').disabled, true);
});

test('login stores user data, failure shows notification', async () => {
    const fetch = mockFetch({
        'POST /users/login': (body) => body.password === '123'
            ? { email: body.email, _id: 'u1', accessToken: 'tok' }
            : reply(403, { message: 'Login or password don\'t match' })
    });
    const { document, window } = await loadPage(page('login.html'), { fetch, root });
    const form = document.getElementById('login-form');

    submit(form, { email: 'peter@abv.bg', password: 'bad' });
    await settle();
    assert.equal(form.querySelector('.notification').textContent, 'Login or password don\'t match');

    submit(form, { password: '123' });
    await settle();
    assert.deepEqual(JSON.parse(window.localStorage.getItem('userData')), user);
});

test('register validates matching passwords', async () => {
    const fetch = mockFetch({ 'POST /users/register': { email: 'a@a.bg', _id: 'u9', accessToken: 'x' } });
    const { document, window } = await loadPage(page('register.html'), { fetch, root });
    const form = document.getElementById('register-form');

    submit(form, { email: 'a@a.bg', password: '1', rePass: '2' });
    await settle();
    assert.equal(fetch.calls.length, 0);
    assert.notEqual(form.querySelector('.notification').textContent, '');

    submit(form, { rePass: '1' });
    await settle();
    assert.equal(JSON.parse(window.localStorage.getItem('userData')).id, 'u9');
});
