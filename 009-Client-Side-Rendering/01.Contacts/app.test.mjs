import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../../test-utils/dom.mjs';

test('renders a card per contact and toggles details', async () => {
    const { document } = await loadPage(new URL('./index.html', import.meta.url));

    const cards = document.querySelectorAll('#contacts .contact');
    assert.equal(cards.length, 6);
    assert.equal(cards[0].querySelector('h2').textContent, 'Name: John');

    const details = document.getElementById('2');
    assert.equal(details.style.display, 'none');
    cards[1].querySelector('.detailsBtn').click();
    assert.equal(details.style.display, 'block');
    assert.equal(details.querySelector('p').textContent, 'Phone number: 0845996111');
    cards[1].querySelector('.detailsBtn').click();
    assert.equal(details.style.display, 'none');
});
