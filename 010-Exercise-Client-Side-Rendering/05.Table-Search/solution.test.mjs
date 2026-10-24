import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch } from '../../test-utils/dom.mjs';

test('renders students and selects matching rows case-insensitively', async () => {
    const fetch = mockFetch({
        'GET /jsonstore/advanced/table': {
            a: { firstName: 'John', lastName: 'Dan', email: 'john@john-dam.com', course: 'JS-CORE' },
            b: { firstName: 'Max', lastName: 'Peterson', email: 'max@softuni.com', course: 'C#-Fundamentals' },
            c: { firstName: 'Philip', lastName: 'Anderson', email: 'philip@softuni.com', course: 'JS-CORE' }
        }
    });
    const { document } = await loadPage(new URL('./index.html', import.meta.url), { fetch });
    const selected = () => [...document.querySelectorAll('tbody tr.select td:first-child')].map((td) => td.textContent);
    const search = (text) => {
        document.getElementById('searchField').value = text;
        document.getElementById('searchBtn').click();
    };

    assert.equal(document.querySelectorAll('tbody tr').length, 3);
    assert.equal(document.querySelector('tbody td').textContent, 'John Dan');

    search('js-core');
    assert.deepEqual(selected(), ['John Dan', 'Philip Anderson']);
    assert.equal(document.getElementById('searchField').value, '');

    search('softuni');
    assert.deepEqual(selected(), ['Max Peterson', 'Philip Anderson']);

    search('');
    assert.deepEqual(selected(), []);
});
