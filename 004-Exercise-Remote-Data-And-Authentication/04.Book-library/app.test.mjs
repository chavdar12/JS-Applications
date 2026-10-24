import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle, submit } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

function booksServer() {
    const db = { b1: { title: 'Harry Potter', author: 'J.K.Rowling' } };
    return mockFetch({
        'GET /jsonstore/collections/books': () => db,
        'POST /jsonstore/collections/books': (body) => (db.b2 = body),
        'PUT /jsonstore/collections/books/b1': (body) => (db.b1 = body),
        'DELETE /jsonstore/collections/books/b1': () => {
            delete db.b1;
            return {};
        }
    });
}

async function loadBooks(fetch) {
    const ctx = await loadPage(page, { fetch });
    ctx.document.getElementById('loadBooks').click();
    await settle();
    return ctx;
}

const titles = (document) => [...document.querySelectorAll('tbody tr td:first-child')].map((td) => td.textContent);

test('load all books renders rows with actions', async () => {
    const { document } = await loadBooks(booksServer());

    assert.deepEqual(titles(document), ['Harry Potter']);
    assert.deepEqual([...document.querySelectorAll('tbody button')].map((b) => b.textContent), ['Edit', 'Delete']);
});

test('create posts a book and ignores empty input', async () => {
    const fetch = booksServer();
    const { document } = await loadBooks(fetch);
    const form = document.getElementById('submit-form');

    submit(form, { title: '', author: 'x' });
    submit(form, { title: 'Dune', author: 'Herbert' });
    await settle();

    assert.deepEqual(fetch.calls.filter((c) => c.method === 'POST').map((c) => c.body), [{ title: 'Dune', author: 'Herbert' }]);
    assert.deepEqual(titles(document), ['Harry Potter', 'Dune']);
});

test('edit swaps forms, saves with PUT and swaps back', async () => {
    const fetch = booksServer();
    const { document } = await loadBooks(fetch);
    const createForm = document.getElementById('submit-form');
    const editForm = document.getElementById('edit-form');

    document.querySelector('tbody button').click();
    assert.equal(editForm.style.display, 'block');
    assert.equal(createForm.style.display, 'none');
    assert.equal(editForm.elements.title.value, 'Harry Potter');

    submit(editForm, { title: 'Harry Potter 2' });
    await settle();

    assert.equal(editForm.style.display, 'none');
    assert.equal(createForm.style.display, 'block');
    assert.deepEqual(titles(document), ['Harry Potter 2']);
});

test('delete removes the book', async () => {
    const { document } = await loadBooks(booksServer());

    document.querySelectorAll('tbody button')[1].click();
    await settle();

    assert.deepEqual(titles(document), []);
});
