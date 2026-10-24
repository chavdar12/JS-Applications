import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage } from '../../test-utils/dom.mjs';

test('loadRepos writes the XHR response text into #res', async () => {
    const opened = [];
    const { document } = await loadPage(new URL('./index.html', import.meta.url), {
        setup(window) {
            window.XMLHttpRequest = class {
                open(method, url) {
                    opened.push([method, url]);
                }
                addEventListener(type, cb) {
                    this.cb = cb;
                }
                send() {
                    Object.assign(this, { readyState: 4, status: 200, responseText: '[{"name":"repo"}]' });
                    this.cb();
                }
            };
        }
    });

    document.querySelector('button').click();

    assert.deepEqual(opened, [['GET', 'https://api.github.com/users/testnakov/repos']]);
    assert.equal(document.getElementById('res').textContent, '[{"name":"repo"}]');
});
