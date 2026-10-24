import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, reply, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

test('lists the user repos as links', async () => {
    const fetch = mockFetch({
        'GET /users/k1r1L/repos': [
            { full_name: 'k1r1L/one', html_url: 'https://github.com/k1r1L/one' },
            { full_name: 'k1r1L/two', html_url: 'https://github.com/k1r1L/two' }
        ]
    });
    const { document } = await loadPage(page, { fetch });

    document.querySelector('button').click();
    await settle();

    const links = [...document.querySelectorAll('#repos li a')];
    assert.deepEqual(links.map((a) => a.textContent), ['k1r1L/one', 'k1r1L/two']);
    assert.equal(links[1].href, 'https://github.com/k1r1L/two');
});

test('shows the error instead of the list', async () => {
    const fetch = mockFetch({ 'GET /users/nobody/repos': reply(404, { message: 'Not Found' }) });
    const { document } = await loadPage(page, { fetch });

    document.getElementById('username').value = 'nobody';
    document.querySelector('button').click();
    await settle();

    const items = document.querySelectorAll('#repos li');
    assert.equal(items.length, 1);
    assert.match(items[0].textContent, /404/);
});
