import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

test('cycles depart/arrive along the schedule', async () => {
    const fetch = mockFetch({
        'GET /jsonstore/bus/schedule/depot': { name: 'Depot', next: '0361' },
        'GET /jsonstore/bus/schedule/0361': { name: 'Rakovski str.', next: 'depot' }
    });
    const { document } = await loadPage(page, { fetch });
    const info = () => document.querySelector('#info span').textContent;
    const depart = document.getElementById('depart');
    const arrive = document.getElementById('arrive');

    depart.click();
    await settle();
    assert.equal(info(), 'Next stop Depot');
    assert.equal(depart.disabled, true);
    assert.equal(arrive.disabled, false);

    arrive.click();
    assert.equal(info(), 'Arriving at Depot');
    assert.equal(depart.disabled, false);
    assert.equal(arrive.disabled, true);

    depart.click();
    await settle();
    assert.equal(info(), 'Next stop Rakovski str.');
});

test('shows Error and disables both buttons when the request fails', async () => {
    const { document } = await loadPage(page, { fetch: mockFetch({}) });

    document.getElementById('depart').click();
    await settle();

    assert.equal(document.querySelector('#info span').textContent, 'Error');
    assert.equal(document.getElementById('depart').disabled, true);
    assert.equal(document.getElementById('arrive').disabled, true);
});
