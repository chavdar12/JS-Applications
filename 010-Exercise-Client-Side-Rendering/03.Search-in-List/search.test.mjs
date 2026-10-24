import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../../test-utils/dom.mjs';
import { towns } from './towns.js';

test('lists towns and highlights matches', async () => {
    const { document } = await loadPage(new URL('./index.html', import.meta.url));
    const active = () => [...document.querySelectorAll('#towns li.active')].map((li) => li.textContent);

    assert.equal(document.querySelectorAll('#towns li').length, towns.length);

    document.getElementById('searchText').value = 'Pl';
    document.querySelector('button').click();
    assert.deepEqual(active(), ['Pleven', 'Plovdiv']);
    assert.equal(document.getElementById('result').textContent, '2 matches found');

    document.getElementById('searchText').value = 'Varna';
    document.querySelector('button').click();
    assert.deepEqual(active(), ['Varna']);

    document.getElementById('searchText').value = '';
    document.querySelector('button').click();
    assert.deepEqual(active(), []);
    assert.equal(document.getElementById('result').textContent, '0 matches found');
});
