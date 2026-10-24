import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle, submit } from '../../test-utils/dom.mjs';

const page = (name) => new URL(`./${name}`, import.meta.url);
const session = { userData: JSON.stringify({ email: 'peter@abv.bg', id: 'u1', token: 'tok' }) };
const sofa = { _id: 'f1', name: 'Sofa', price: '259', factor: '0.4', img: 'sofa.jpg' };
const chair = { _id: 'f2', name: 'Chair', price: '160', factor: '0.5', img: 'chair.jpg' };

test('local task: Generate adds rows from JSON, Buy summarises checked ones', async () => {
    const { document } = await loadPage(page('index.html'));
    const [input, output] = document.querySelectorAll('textarea');
    const [generate, buy] = document.querySelectorAll('#exercise > button');

    input.value = JSON.stringify([
        { img: 'a.jpg', name: 'Sofa', price: '259', decFactor: '0.4' },
        { img: 'b.jpg', name: 'Wardrobe', price: '120', decFactor: '1.2' }
    ]);
    generate.click();
    const rows = document.querySelectorAll('tbody tr');
    assert.equal(rows.length, 3);
    rows[1].querySelector('input').checked = true;
    rows[2].querySelector('input').checked = true;
    buy.click();

    assert.equal(output.value, 'Bought furniture: Sofa, Wardrobe\nTotal price: 379.00\nAverage decoration factor: 0.8');
});

test('guest catalog lists furniture with disabled checkboxes', async () => {
    const fetch = mockFetch({ 'GET /data/furniture': [sofa, chair] });
    const { document } = await loadPage(page('home.html'), { fetch });

    assert.equal(document.getElementById('user').style.display, 'none');
    const rows = document.querySelectorAll('tbody tr');
    assert.equal(rows.length, 2);
    assert.equal(rows[0].querySelectorAll('p')[0].textContent, 'Sofa');
    assert.equal(rows[0].querySelector('input').disabled, true);
});

test('logged in user buys checked furniture and sees all orders', async () => {
    const orders = [];
    const fetch = mockFetch({
        'GET /data/furniture': [sofa, chair],
        'POST /data/orders': (body) => {
            orders.push({ ...body, _ownerId: 'u1' });
            return body;
        },
        'GET /data/orders?where=_ownerId%3D%22u1%22': () => orders
    });
    const { document } = await loadPage(page('homeLogged.html'), { fetch, session });
    const checkboxes = document.querySelectorAll('tbody input');
    assert.equal(checkboxes[0].disabled, false);

    checkboxes[0].checked = true;
    checkboxes[1].checked = true;
    document.getElementById('buy-btn').click();
    await settle();
    assert.equal(fetch.calls.filter((c) => c.method === 'POST').every((c) => c.headers['x-authorization'] === 'tok'), true);

    document.getElementById('show-orders-btn').click();
    await settle();
    const [names, total] = document.querySelectorAll('.orders span');
    assert.equal(names.textContent, 'Sofa, Chair');
    assert.equal(total.textContent, '419 $');
});

test('login and register store the session; errors alert', async () => {
    const fetch = mockFetch({
        'POST /users/login': reply(403, { message: 'Login or password don\'t match' }),
        'POST /users/register': (body) => ({ email: body.email, _id: 'u5', accessToken: 'new' })
    });
    const { document, window, alerts } = await loadPage(page('login.html'), { fetch });

    submit(document.getElementById('login-form'), { email: 'a@a.bg', password: 'x' });
    submit(document.getElementById('register-form'), { email: 'a@a.bg', password: '1', rePass: '2' });
    await settle();
    assert.deepEqual(alerts, ['Passwords don\'t match!', 'Login or password don\'t match']);

    submit(document.getElementById('register-form'), { rePass: '1' });
    await settle();
    assert.equal(JSON.parse(window.sessionStorage.getItem('userData')).token, 'new');
});

test('create posts the product with the auth token', async () => {
    const fetch = mockFetch({ 'POST /data/furniture': (body) => body });
    const { document, alerts } = await loadPage(page('create.html'), { fetch, session });

    submit(document.getElementById('create-form'), { name: 'Table', price: '99', factor: '1', img: 't.png' });
    await settle();

    assert.deepEqual(alerts, []);
    assert.deepEqual(fetch.calls[0].body, { name: 'Table', price: '99', factor: '1', img: 't.png' });
    assert.equal(fetch.calls[0].headers['x-authorization'], 'tok');
});
