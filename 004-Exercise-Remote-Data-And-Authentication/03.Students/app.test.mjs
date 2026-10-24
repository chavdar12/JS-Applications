import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle, submit } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const student = { firstName: 'Isaac', lastName: 'Netero', facultyNumber: '9000', grade: 4.99, _id: 's1' };

test('loads students into the table on start', async () => {
    const fetch = mockFetch({ 'GET /jsonstore/collections/students': { s1: student } });
    const { document } = await loadPage(page, { fetch });

    const cells = [...document.querySelectorAll('#results tbody td')].map((td) => td.textContent);
    assert.deepEqual(cells, ['Isaac', 'Netero', '9000', '4.99']);
});

test('submits a valid student and appends the row', async () => {
    const fetch = mockFetch({
        'GET /jsonstore/collections/students': {},
        'POST /jsonstore/collections/students': (body) => ({ ...body, _id: 's2' })
    });
    const { document } = await loadPage(page, { fetch });

    submit(document.getElementById('form'), { firstName: 'Gon', lastName: 'Freecss', facultyNumber: '1', grade: '5' });
    await settle();

    assert.deepEqual(fetch.calls[1].body, { firstName: 'Gon', lastName: 'Freecss', facultyNumber: '1', grade: 5 });
    assert.equal(document.querySelectorAll('#results tbody tr').length, 1);
    assert.equal(document.querySelector('[name="firstName"]').value, '');
});

test('rejects empty fields and non-numeric grade', async () => {
    const fetch = mockFetch({ 'GET /jsonstore/collections/students': {} });
    const { document } = await loadPage(page, { fetch });
    const form = document.getElementById('form');

    submit(form, { firstName: 'Gon', lastName: '', facultyNumber: '1', grade: '5' });
    submit(form, { firstName: 'Gon', lastName: 'F', facultyNumber: '1', grade: 'abc' });
    await settle();

    assert.equal(fetch.calls.length, 1);
    assert.notEqual(form.querySelector('.notification').textContent, '');
});
