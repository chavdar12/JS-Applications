import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const fetch = mockFetch({
    'GET /jsonstore/bus/businfo/1287': { name: 'Orlov Most sq.', buses: { 76: 15, 84: 10 } }
});

async function check(document, stopId) {
    document.getElementById('stopId').value = stopId;
    document.getElementById('submit').click();
    await settle();
}

test('shows stop name and arriving buses', async () => {
    const { document } = await loadPage(page, { fetch });

    await check(document, '1287');

    assert.equal(document.getElementById('stopName').textContent, 'Orlov Most sq.');
    assert.deepEqual([...document.querySelectorAll('#buses li')].map((li) => li.textContent),
        ['Bus 76 arrives in 15 minutes', 'Bus 84 arrives in 10 minutes']);
});

test('shows Error and clears buses for an unknown stop', async () => {
    const { document } = await loadPage(page, { fetch });

    await check(document, '1287');
    await check(document, '9999');

    assert.equal(document.getElementById('stopName').textContent, 'Error');
    assert.equal(document.querySelectorAll('#buses li').length, 0);
});
