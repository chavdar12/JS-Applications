import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const fetch = mockFetch({
    'GET /jsonstore/advanced/profiles': {
        a: { _id: 'a', username: 'John', email: 'john@users.bg', age: 31 },
        b: { _id: 'b', username: '<b>Peter</b>', email: 'peter@users.bg', age: 56 }
    }
});

test('renders one profile per user', async () => {
    const { document } = await loadPage(page, { fetch });

    const profiles = document.querySelectorAll('.profile');
    assert.equal(profiles.length, 2);
    assert.equal(document.querySelector('[name="user1Username"]').value, 'John');
    assert.equal(document.querySelector('[name="user2Username"]').value, '<b>Peter</b>');
    assert.equal(document.querySelector('[name="user2Email"]').value, 'peter@users.bg');
});

test('locked profile does not reveal hidden info', async () => {
    const { document } = await loadPage(page, { fetch });
    const button = document.querySelector('.profile button');

    button.click();

    assert.equal(button.textContent, 'Show more');
    assert.equal(document.querySelector('[name="user1Email"]').style.display, '');
});

test('unlocked profile toggles hidden info', async () => {
    const { document } = await loadPage(page, { fetch });
    const profile = document.querySelector('.profile');
    const button = profile.querySelector('button');

    profile.querySelector('input[value="unlock"]').checked = true;
    button.click();
    assert.equal(button.textContent, 'Hide it');
    assert.equal(document.querySelector('[name="user1Email"]').style.display, 'block');

    button.click();
    assert.equal(button.textContent, 'Show more');
    assert.equal(document.querySelector('[name="user1Email"]').style.display, '');
});
