import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const posts = {
    p1: { id: 'p1', title: 'First', body: 'Body one' },
    p2: { id: 'p2', title: 'Second', body: 'Body two' }
};
const fetch = mockFetch({
    'GET /jsonstore/blog/posts': posts,
    'GET /jsonstore/blog/posts/p2': posts.p2,
    'GET /jsonstore/blog/comments': {
        c1: { id: 'c1', postId: 'p1', text: 'not mine' },
        c2: { id: 'c2', postId: 'p2', text: 'Nice!' }
    }
});

test('loads posts into the select and shows the chosen post with its comments', async () => {
    const { document } = await loadPage(page, { fetch });

    document.getElementById('btnLoadPosts').click();
    await settle();
    const options = [...document.querySelectorAll('#posts option')];
    assert.deepEqual(options.map((o) => [o.value, o.textContent]), [['p1', 'First'], ['p2', 'Second']]);

    document.getElementById('posts').value = 'p2';
    document.getElementById('btnViewPost').click();
    await settle();

    assert.equal(document.getElementById('post-title').textContent, 'Second');
    assert.equal(document.getElementById('post-body').textContent, 'Body two');
    const comments = [...document.querySelectorAll('#post-comments li')];
    assert.deepEqual(comments.map((li) => [li.id, li.textContent]), [['c2', 'Nice!']]);
});
