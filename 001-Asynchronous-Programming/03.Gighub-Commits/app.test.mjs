import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

test('lists commits as "author: message"', async () => {
    const fetch = mockFetch({
        'GET /repos/nakov/nakov.io.cin/commits': [
            { commit: { author: { name: 'Nakov' }, message: 'Initial' } },
            { commit: { author: { name: 'Ivan' }, message: 'Fix' } }
        ]
    });
    const { document } = await loadPage(page, { fetch });

    document.querySelector('button').click();
    await settle();

    assert.deepEqual([...document.querySelectorAll('#commits li')].map((li) => li.textContent),
        ['Nakov: Initial', 'Ivan: Fix']);
});

test('shows the status code on error', async () => {
    const fetch = mockFetch({ 'GET /repos/nakov/missing/commits': reply(404, {}) });
    const { document } = await loadPage(page, { fetch });

    document.getElementById('repo').value = 'missing';
    document.querySelector('button').click();
    await settle();

    assert.equal(document.querySelector('#commits').textContent, 'Error: 404 (Not Found)');
});
