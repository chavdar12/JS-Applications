import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle, submit } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

function booksServer() {
    const db = {
        d953e5fb: { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K.Rowling' },
        d953e5fc: { title: 'C# Fundamentals', author: 'Svetlin Nakov' }
    };
    return mockFetch({
        'GET /jsonstore/collections/books': () => db,
        'GET /jsonstore/collections/books/d953e5fb': () => db.d953e5fb,
        'POST /jsonstore/collections/books': (body) => (db.new1 = body),
        'PUT /jsonstore/collections/books/d953e5fb': (body) => (db.d953e5fb = body),
        'DELETE /jsonstore/collections/books/d953e5fc': () => {
            delete db.d953e5fc;
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

test('load all books', async () => {
    const { document } = await loadBooks(booksServer());

    assert.deepEqual(titles(document), ['Harry Potter and the Philosopher\'s Stone', 'C# Fundamentals']);
    assert.equal(document.querySelectorAll('tbody .editBtn').length, 2);
});

test('add book sends correct data and ignores empty fields', async () => {
    const fetch = booksServer();
    const { document } = await loadBooks(fetch);
    const form = document.getElementById('createForm');

    submit(form, { title: 'Title', author: '' });
    submit(form, { title: 'Title', author: 'Author' });
    await settle();

    assert.deepEqual(fetch.calls.filter((c) => c.method === 'POST').map((c) => c.body), [{ title: 'Title', author: 'Author' }]);
    assert.equal(titles(document).at(-1), 'Title');
});

test('edit loads the book into the edit form and saves with PUT', async () => {
    const fetch = booksServer();
    const { document } = await loadBooks(fetch);
    const editForm = document.getElementById('editForm');

    document.querySelector('tbody .editBtn').click();
    await settle();
    assert.equal(editForm.style.display, 'block');
    assert.equal(editForm.elements.id.value, 'd953e5fb');
    assert.equal(editForm.elements.author.value, 'J.K.Rowling');

    submit(editForm, { title: 'HP' });
    await settle();
    assert.deepEqual(fetch.calls.find((c) => c.method === 'PUT').body, { title: 'HP', author: 'J.K.Rowling' });
    assert.equal(document.getElementById('createForm').style.display, 'block');
    assert.equal(titles(document)[0], 'HP');
});

test('delete removes the book', async () => {
    const { document } = await loadBooks(booksServer());

    document.querySelectorAll('tbody .deleteBtn')[1].click();
    await settle();

    assert.deepEqual(titles(document), ['Harry Potter and the Philosopher\'s Stone']);
});
