import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

function phonebookServer() {
    const db = { k1: { person: 'Maya', phone: '+1-555-7653', _id: 'k1' } };
    return mockFetch({
        'GET /jsonstore/phonebook': () => db,
        'POST /jsonstore/phonebook': (body) => (db.k2 = { ...body, _id: 'k2' }),
        'DELETE /jsonstore/phonebook/k1': () => {
            const removed = db.k1;
            delete db.k1;
            return removed;
        }
    });
}

test('load lists contacts with delete buttons', async () => {
    const { document } = await loadPage(page, { fetch: phonebookServer() });

    document.getElementById('btnLoad').click();
    await settle();

    const items = document.querySelectorAll('#phonebook li');
    assert.equal(items.length, 1);
    assert.equal(items[0].firstChild.textContent, 'Maya: +1-555-7653');
    assert.equal(items[0].querySelector('button').textContent, 'Delete');
});

test('delete removes the contact and reloads', async () => {
    const fetch = phonebookServer();
    const { document } = await loadPage(page, { fetch });

    document.getElementById('btnLoad').click();
    await settle();
    document.querySelector('#phonebook li button').click();
    await settle();

    assert.ok(fetch.calls.some((c) => c.method === 'DELETE' && c.path === '/jsonstore/phonebook/k1'));
    assert.equal(document.querySelectorAll('#phonebook li').length, 0);
});

test('create posts the contact, clears inputs and reloads', async () => {
    const fetch = phonebookServer();
    const { document } = await loadPage(page, { fetch });

    document.getElementById('person').value = 'Ivan';
    document.getElementById('phone').value = '0888';
    document.getElementById('btnCreate').click();
    await settle();

    assert.deepEqual(fetch.calls[0].body, { person: 'Ivan', phone: '0888' });
    assert.equal(document.getElementById('person').value, '');
    assert.equal(document.querySelectorAll('#phonebook li').length, 2);
});
