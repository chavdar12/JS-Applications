import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const fetch = mockFetch({
    'GET /jsonstore/forecaster/locations': [{ code: 'london', name: 'London' }],
    'GET /jsonstore/forecaster/today/london': { name: 'London, UK', forecast: { condition: 'Rain', high: '8', low: '2' } },
    'GET /jsonstore/forecaster/upcoming/london': {
        name: 'London',
        forecast: [
            { condition: 'Sunny', high: '8', low: '6' },
            { condition: 'Overcast', high: '11', low: '3' },
            { condition: 'Partly sunny', high: '8', low: '5' }
        ]
    }
});

async function search(document, location) {
    document.getElementById('location').value = location;
    document.getElementById('submit').click();
    await settle();
}

test('renders current and three-day forecast', async () => {
    const { document } = await loadPage(page, { fetch });

    await search(document, 'London');

    assert.equal(document.getElementById('forecast').style.display, 'block');
    assert.equal(document.querySelector('#current .symbol').textContent, '☔');
    assert.deepEqual([...document.querySelectorAll('#current .forecast-data')].map((s) => s.textContent),
        ['London, UK', '2°/8°', 'Rain']);
    const upcoming = document.querySelectorAll('#upcoming .upcoming');
    assert.equal(upcoming.length, 3);
    assert.equal(upcoming[1].textContent, '☁3°/11°Overcast');
});

test('searching twice does not duplicate results', async () => {
    const { document } = await loadPage(page, { fetch });

    await search(document, 'London');
    await search(document, 'London');

    assert.equal(document.querySelectorAll('#current .forecasts').length, 1);
    assert.equal(document.querySelectorAll('#upcoming .upcoming').length, 3);
});

test('shows Error for an unknown location', async () => {
    const { document } = await loadPage(page, { fetch });

    await search(document, 'Atlantis');

    assert.equal(document.getElementById('forecast').style.display, 'block');
    assert.equal(document.querySelector('#forecast .error').textContent, 'Error');
    assert.equal(document.querySelector('#current .forecasts'), null);
});
