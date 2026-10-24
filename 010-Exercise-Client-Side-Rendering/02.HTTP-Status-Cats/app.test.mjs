import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../../test-utils/dom.mjs';

test('renders all cats and toggles the status code', async () => {
    const { document } = await loadPage(new URL('./index.html', import.meta.url));

    const items = document.querySelectorAll('#allCats li');
    assert.equal(items.length, 11);
    assert.equal(items[6].querySelector('img').getAttribute('src'), './images/cat404.jpg');

    const button = items[6].querySelector('.showBtn');
    const status = document.getElementById('404');
    assert.equal(status.style.display, 'none');

    button.click();
    assert.equal(status.style.display, 'block');
    assert.equal(button.textContent.trim(), 'Hide status code');
    assert.equal(status.querySelector('p').textContent, 'Not Found');

    button.click();
    assert.equal(status.style.display, 'none');
    assert.equal(button.textContent.trim(), 'Show status code');
});
