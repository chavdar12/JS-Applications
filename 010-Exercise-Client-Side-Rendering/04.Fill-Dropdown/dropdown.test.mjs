import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

test('fills the menu on load and adds new items', async () => {
    const items = { a: { _id: 'a', text: 'Rome' }, b: { _id: 'b', text: 'Amsterdam' } };
    const fetch = mockFetch({
        'GET /jsonstore/advanced/dropdown': () => items,
        'POST /jsonstore/advanced/dropdown': (body) => (items.c = { ...body, _id: 'c' })
    });
    const { document } = await loadPage(new URL('./index.html', import.meta.url), { fetch });
    const options = () => [...document.querySelectorAll('#menu option')].map((o) => [o.value, o.textContent]);

    assert.deepEqual(options(), [['a', 'Rome'], ['b', 'Amsterdam']]);

    document.getElementById('itemText').value = '   ';
    document.querySelector('[type="submit"]').click();
    document.getElementById('itemText').value = 'Sofia';
    document.querySelector('[type="submit"]').click();
    await settle();

    assert.deepEqual(fetch.calls.filter((c) => c.method === 'POST').map((c) => c.body), [{ text: 'Sofia' }]);
    assert.deepEqual(options().at(-1), ['c', 'Sofia']);
    assert.equal(document.getElementById('itemText').value, '');
});
