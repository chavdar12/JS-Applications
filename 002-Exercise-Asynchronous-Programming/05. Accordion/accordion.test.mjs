import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const fetch = mockFetch({
    'GET /jsonstore/advanced/articles/list': [
        { _id: 'svg', title: 'Scalable Vector Graphics' },
        { _id: 'open', title: 'Open standard' }
    ],
    'GET /jsonstore/advanced/articles/details/open': { _id: 'open', title: 'Open standard', content: 'An open standard is...' }
});

test('renders an accordion per article', async () => {
    const { document } = await loadPage(page, { fetch });

    assert.deepEqual([...document.querySelectorAll('.accordion .head span')].map((s) => s.textContent),
        ['Scalable Vector Graphics', 'Open standard']);
    assert.equal(document.querySelectorAll('.accordion button')[1].id, 'open');
});

test('More loads and shows details, Less hides them', async () => {
    const { document } = await loadPage(page, { fetch });
    const button = document.getElementById('open');
    const extra = button.closest('.accordion').querySelector('.extra');

    button.click();
    await settle();
    assert.equal(button.textContent, 'Less');
    assert.equal(extra.style.display, 'block');
    assert.equal(extra.textContent.trim(), 'An open standard is...');

    button.click();
    assert.equal(button.textContent, 'More');
    assert.equal(extra.style.display, 'none');
});
