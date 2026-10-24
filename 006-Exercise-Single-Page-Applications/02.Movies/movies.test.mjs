import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const storage = { user: JSON.stringify({ email: 'peter@abv.bg', id: 'u1', token: 'tok' }) };
const mine = { _id: 'm1', _ownerId: 'u1', title: 'Black Widow', description: 'Natasha', img: 'bw.jpg' };
const theirs = { ...mine, _id: 'm2', _ownerId: 'u2', title: 'Wonder Woman' };
const likesCount = (id) => `GET /data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`;
const ownLikes = (id) => `GET /data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22u1%22`;

const currentView = (document) => document.querySelector('#container > section').id;
const shown = (el) => el.style.display !== 'none';
const navClick = (document, href) => document.querySelector(`a[href="${href}"]`).click();

test('guest home lists movies, hides Add Movie and user nav', async () => {
    const fetch = mockFetch({ 'GET /data/movies': [mine, theirs] });
    const { document } = await loadPage(page, { fetch });

    assert.equal(currentView(document), 'home');
    assert.deepEqual([...document.querySelectorAll('.card-title')].map((h) => h.textContent), ['Black Widow', 'Wonder Woman']);
    assert.equal(shown(document.getElementById('add-movie-button')), false);
    assert.equal(shown(document.querySelector('.logged-in-user')), false);
});

test('owner sees edit/delete but no like; deleting returns home', async () => {
    const fetch = mockFetch({
        'GET /data/movies': [mine],
        'GET /data/movies/m1': mine,
        [likesCount('m1')]: 3,
        [ownLikes('m1')]: [],
        'DELETE /data/movies/m1': {}
    });
    const { document } = await loadPage(page, { fetch, storage });
    assert.equal(document.getElementById('welcome-user-email').textContent, 'Welcome, peter@abv.bg');

    document.querySelector('.movie-details').click();
    await settle();
    assert.equal(document.getElementById('movie-details-title').textContent, 'Movie title: Black Widow');
    assert.equal(document.getElementById('likes').textContent, 'Liked 3');
    assert.equal(shown(document.getElementById('edit-btn')), true);
    assert.equal(shown(document.getElementById('like-btn')), false);

    document.getElementById('delete-btn').click();
    await settle();
    assert.ok(fetch.calls.some((c) => c.method === 'DELETE'));
    assert.equal(currentView(document), 'home');
});

test('non-owner can like once', async () => {
    let liked = false;
    const fetch = mockFetch({
        'GET /data/movies': [theirs],
        'GET /data/movies/m2': theirs,
        [likesCount('m2')]: () => (liked ? 1 : 0),
        [ownLikes('m2')]: () => (liked ? [{ movieId: 'm2' }] : []),
        'POST /data/likes': (body) => {
            liked = true;
            return body;
        }
    });
    const { document } = await loadPage(page, { fetch, storage });

    document.querySelector('.movie-details').click();
    await settle();
    assert.equal(shown(document.getElementById('delete-btn')), false);
    document.getElementById('like-btn').click();
    await settle();

    assert.deepEqual(fetch.calls.find((c) => c.method === 'POST').body, { movieId: 'm2' });
    assert.equal(document.getElementById('likes').textContent, 'Liked 1');
    assert.equal(shown(document.getElementById('like-btn')), false);
});

test('add and edit movie', async () => {
    const fetch = mockFetch({
        'GET /data/movies': [],
        'POST /data/movies': (b) => ({ ...b, _id: 'm1', _ownerId: 'u1' }),
        'GET /data/movies/m1': mine,
        [likesCount('m1')]: 0,
        [ownLikes('m1')]: [],
        'PUT /data/movies/m1': (b) => ({ ...mine, ...b })
    });
    const { document, alerts } = await loadPage(page, { fetch, storage });

    navClick(document, '/add-movie');
    const addForm = document.getElementById('add-movie-form');
    submit(addForm, { title: 'X' });
    assert.equal(alerts.length, 1);
    submit(addForm, { title: 'Black Widow', description: 'Natasha', imageUrl: 'bw.jpg' });
    await settle();
    assert.deepEqual(fetch.calls.find((c) => c.method === 'POST').body, { title: 'Black Widow', description: 'Natasha', img: 'bw.jpg' });
    assert.equal(currentView(document), 'movie-example');

    document.getElementById('edit-btn').click();
    const editForm = document.getElementById('edit-movie-form');
    assert.equal(editForm.elements.title.value, 'Black Widow');
    submit(editForm, { title: 'Black Widow 2' });
    await settle();
    assert.equal(fetch.calls.find((c) => c.method === 'PUT').body.title, 'Black Widow 2');
});

test('register validates, login stores the user, logout goes to login', async () => {
    const fetch = mockFetch({
        'GET /data/movies': [],
        'POST /users/register': reply(409, { message: 'User exists' }),
        'POST /users/login': { email: 'a@a.bg', _id: 'u3', accessToken: 't3' },
        'GET /users/logout': reply(204)
    });
    const { document, window, alerts } = await loadPage(page, { fetch });

    navClick(document, '/register');
    const reg = document.getElementById('register-user');
    submit(reg, { email: 'a@a.bg', password: '123', repeatPassword: '123' });
    submit(reg, { password: '123456', repeatPassword: '654321' });
    submit(reg, { repeatPassword: '123456' });
    await settle();
    assert.deepEqual(alerts, ['Password must be at least 6 characters long!', 'Passwords don\'t match!', 'User exists']);

    navClick(document, '/login');
    submit(document.getElementById('login-user'), { email: 'a@a.bg', password: '123456' });
    await settle();
    assert.equal(JSON.parse(window.localStorage.getItem('user')).token, 't3');
    assert.equal(currentView(document), 'home');

    document.getElementById('logout-btn').click();
    await settle();
    assert.equal(window.localStorage.getItem('user'), null);
    assert.equal(currentView(document), 'form-login');
});
