import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle, submit } from '../../test-utils/dom.mjs';

test('renders the whole library with lit-html and supports CRUD', async () => {
    const db = { b1: { title: 'Harry Potter', author: 'J. K. Rowling' }, b2: { title: 'Game of Thrones', author: 'George R. R. Martin' } };
    const fetch = mockFetch({
        'GET /jsonstore/collections/books': () => db,
        'POST /jsonstore/collections/books': (body) => (db.b3 = body),
        'PUT /jsonstore/collections/books/b1': (body) => (db.b1 = body),
        'DELETE /jsonstore/collections/books/b2': () => {
            delete db.b2;
            return {};
        }
    });
    const { document } = await loadPage(new URL('./index.html', import.meta.url), { fetch });
    const titles = () => [...document.querySelectorAll('tbody tr td:first-child')].map((td) => td.textContent);
    const buttons = (text) => [...document.querySelectorAll('tbody button')].filter((b) => b.textContent === text);

    assert.ok(document.getElementById('add-form'));
    assert.equal(document.getElementById('edit-form'), null);

    document.getElementById('loadBooks').click();
    await settle();
    assert.deepEqual(titles(), ['Harry Potter', 'Game of Thrones']);

    submit(document.getElementById('add-form'), { title: 'Dune', author: 'Herbert' });
    await settle();
    assert.deepEqual(titles(), ['Harry Potter', 'Game of Thrones', 'Dune']);

    buttons('Edit')[0].click();
    const editForm = document.getElementById('edit-form');
    assert.equal(document.getElementById('add-form'), null);
    assert.equal(editForm.elements.title.value, 'Harry Potter');
    submit(editForm, { title: 'Harry Potter 2' });
    await settle();
    assert.equal(titles()[0], 'Harry Potter 2');
    assert.ok(document.getElementById('add-form'));

    buttons('Delete')[1].click();
    await settle();
    assert.deepEqual(titles(), ['Harry Potter 2', 'Dune']);
});
