import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);

const visible = (document) => [...document.querySelectorAll('body > section')]
    .filter((s) => s.style.display !== 'none')
    .map((s) => s.id);

const cell = (document, sectionId, text) => [...document.querySelectorAll(`#${sectionId} td.day`)]
    .find((td) => td.textContent.trim() === text);

test('starts with only the years view', async () => {
    const { document } = await loadPage(page);
    assert.deepEqual(visible(document), ['years']);
});

test('drills down year -> month and back up via captions', async () => {
    const { document } = await loadPage(page);

    cell(document, 'years', '2021').click();
    assert.deepEqual(visible(document), ['year-2021']);

    cell(document, 'year-2021', 'Sept').click();
    assert.deepEqual(visible(document), ['month-2021-9']);

    document.querySelector('#month-2021-9 caption').click();
    assert.deepEqual(visible(document), ['year-2021']);

    document.querySelector('#year-2021 caption').click();
    assert.deepEqual(visible(document), ['years']);
});
