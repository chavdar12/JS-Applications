import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { click as userClick, loadPage, mockFetch, reply, settle, submit } from '../../../test-utils/dom.mjs';

// page.js is a singleton bound to one window, so the whole file walks through one session.
const mock = JSON.parse(await readFile(new URL('./mock-data.json', import.meta.url), 'utf8'));
const root = new URL('../', import.meta.url);
const IDEAS = 'GET /data/ideas?select=_id%2Ctitle%2Cimg&sortBy=_createdOn%20desc';
let ideas = [];
const fetch = mockFetch({
    [IDEAS]: () => ideas,
    'GET /data/ideas/0003': { ...mock.details, _ownerId: 'u1' },
    'POST /data/ideas': (body) => {
        ideas = [{ ...body, _id: '0004', _ownerId: 'u1' }];
        return ideas[0];
    },
    'DELETE /data/ideas/0003': {},
    'POST /users/register': reply(409, { message: 'A user with the same email already exists' }),
    'POST /users/login': { email: 'peter@abv.bg', _id: 'u1', accessToken: 'tok' },
    'GET /users/logout': reply(204)
});
let ctx;

const click = (selector) => userClick(ctx.document.querySelector(selector));
const path = () => ctx.window.location.pathname;
const shown = (selector) => ctx.document.querySelector(selector).style.display !== 'none';

before(async () => {
    ctx = await loadPage(new URL('index.html', root), { fetch, root });
});

test('guest lands on home with guest navigation', () => {
    assert.equal(path(), '/');
    assert.match(ctx.document.querySelector('#main h2').textContent, /Do you wonder/);
    assert.equal(shown('.guest'), true);
    assert.equal(shown('.user'), false);
});

test('empty dashboard shows the placeholder', async () => {
    click('a[href="/dashboard"]');
    await settle();
    assert.equal(path(), '/dashboard');
    assert.equal(ctx.document.querySelector('#dashboard-holder h1').textContent, 'No ideas yet! Be the first one :)');
});

test('register validates input and shows server errors', async () => {
    click('a[href="/register"]');
    await settle();
    const form = ctx.document.querySelector('#main form');
    submit(form, { email: 'peter@abv.bg', password: '123', repeatPassword: '321' });
    submit(form, { repeatPassword: '123' });
    await settle();
    assert.deepEqual(ctx.alerts, ['Passwords don\'t match!', 'A user with the same email already exists']);
});

test('login stores the user and switches navigation', async () => {
    click('a[href="/login"]');
    await settle();
    submit(ctx.document.querySelector('#main form'), { email: 'peter@abv.bg', password: '123' });
    await settle();
    assert.equal(JSON.parse(ctx.window.localStorage.getItem('userData')).token, 'tok');
    assert.equal(path(), '/');
    assert.equal(shown('.user'), true);
    assert.equal(shown('.guest'), false);
});

test('create validates and posts an idea, then shows it on the dashboard', async () => {
    ctx.alerts.length = 0;
    click('a[href="/create"]');
    await settle();
    const form = ctx.document.querySelector('#main form');
    submit(form, { title: 'short', description: 'long enough text', imageURL: 'http://x' });
    submit(form, { title: 'Dinner Recipe' });
    await settle();

    assert.equal(ctx.alerts.length, 1);
    const post = fetch.calls.find((c) => c.method === 'POST' && c.path === '/data/ideas');
    assert.equal(post.headers['x-authorization'], 'tok');
    assert.deepEqual(post.body, { title: 'Dinner Recipe', description: 'long enough text', img: 'http://x' });
    assert.equal(path(), '/dashboard');
    assert.equal(ctx.document.querySelector('.card-text').textContent, 'Dinner Recipe');
});

test('owner sees delete on details and deleting returns to dashboard', async () => {
    ctx.window.history.pushState(null, '', '/');
    ideas = mock.ideas;
    click('a[href="/dashboard"]');
    await settle();
    assert.equal(ctx.document.querySelectorAll('.card').length, 3);

    click('a[href="/details/0003"]');
    await settle();
    assert.equal(ctx.document.querySelector('.idea-description').textContent, '1111111111');

    click('.detb');
    await settle();
    assert.ok(fetch.calls.some((c) => c.method === 'DELETE' && c.path === '/data/ideas/0003'));
    assert.equal(path(), '/dashboard');
});

test('logout clears the session', async () => {
    click('#logout-btn');
    await settle();
    assert.equal(ctx.window.localStorage.getItem('userData'), null);
    assert.equal(shown('.guest'), true);
    assert.equal(path(), '/');
});
