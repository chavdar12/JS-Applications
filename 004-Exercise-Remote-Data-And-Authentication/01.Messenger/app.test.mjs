import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

test('refresh shows all messages one per line', async () => {
    const fetch = mockFetch({
        'GET /jsonstore/messenger': {
            a: { author: 'Spami', content: 'Init message' },
            b: { author: 'Garry', content: 'Hello' }
        }
    });
    const { document } = await loadPage(page, { fetch });

    document.getElementById('refresh').click();
    await settle();

    assert.equal(document.getElementById('messages').value, 'Spami: Init message\nGarry: Hello');
});

test('send posts the message and clears the content field', async () => {
    const fetch = mockFetch({ 'POST /jsonstore/messenger': (body) => ({ ...body, _id: '1' }) });
    const { document } = await loadPage(page, { fetch });
    document.querySelector('[name="author"]').value = 'Pesho';
    document.querySelector('[name="content"]').value = 'Hi';

    document.getElementById('submit').click();
    await settle();

    assert.deepEqual(fetch.calls[0].body, { author: 'Pesho', content: 'Hi' });
    assert.equal(document.querySelector('[name="content"]').value, '');
    assert.equal(document.querySelector('[name="author"]').value, 'Pesho');
});

test('send ignores empty fields', async () => {
    const fetch = mockFetch({});
    const { document } = await loadPage(page, { fetch });

    document.getElementById('submit').click();
    await settle();

    assert.equal(fetch.calls.length, 0);
});
