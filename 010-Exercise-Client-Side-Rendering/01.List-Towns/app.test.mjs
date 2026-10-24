import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, submit } from '../../test-utils/dom.mjs';

test('renders comma separated towns as a list and replaces it on the next load', async () => {
    const { document } = await loadPage(new URL('./index.html', import.meta.url));
    const form = document.querySelector('form');
    const items = () => [...document.querySelectorAll('#root li')].map((li) => li.textContent);

    submit(form, { towns: 'Sofia, Varna,Pleven' });
    assert.deepEqual(items(), ['Sofia', 'Varna', 'Pleven']);
    assert.equal(document.getElementById('towns').value, '');

    submit(form, { towns: '<b>Burgas</b>' });
    assert.deepEqual(items(), ['<b>Burgas</b>']);
    assert.equal(document.querySelector('#root b'), null);
});
