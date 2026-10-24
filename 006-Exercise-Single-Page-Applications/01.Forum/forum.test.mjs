import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, mockFetch, settle, type } from '../../test-utils/dom.mjs';

const page = new URL('./index.html', import.meta.url);
const topic = { _id: 'p1', title: 'Angular 10', username: 'David', content: 'Lorem', createdOn: '2020-10-10T12:08:28.451Z' };

function forumServer() {
    const posts = { p1: topic };
    const comments = {
        c1: { _id: 'c1', postId: 'p1', username: 'Daniel', text: 'Nice', createdOn: '2021-03-15T00:39:02.000Z' },
        c2: { _id: 'c2', postId: 'other', username: 'X', text: 'not here', createdOn: '2021-03-15T00:39:02.000Z' }
    };
    return mockFetch({
        'GET /jsonstore/collections/myboard/posts': () => posts,
        'POST /jsonstore/collections/myboard/posts': (body) => (posts.p2 = { ...body, _id: 'p2' }),
        'GET /jsonstore/collections/myboard/posts/p1': topic,
        'GET /jsonstore/collections/myboard/comments': () => comments,
        'POST /jsonstore/collections/myboard/comments': (body) => ({ ...body, _id: 'c3' })
    });
}

const fill = (form, values) => Object.entries(values).forEach(([k, v]) => type(form.elements[k], v));
const topicTitles = (document) => [...document.querySelectorAll('.topic-container h2')].map((h) => h.textContent);

test('home lists topics from the server instead of the sample', async () => {
    const { document } = await loadPage(page, { fetch: forumServer() });

    assert.deepEqual(topicTitles(document), ['Angular 10']);
    assert.equal(document.querySelector('.nick-name span').textContent, 'David');
    assert.equal(document.getElementById('current-post'), null);
});

test('post creates a topic; empty fields alert; cancel clears', async () => {
    const fetch = forumServer();
    const { document, alerts } = await loadPage(page, { fetch });
    const form = document.getElementById('create-post-form');

    fill(form, { topicName: 'Vue', username: '' });
    form.querySelector('.public').click();
    assert.equal(alerts.length, 1);

    form.querySelector('.cancel').click();
    assert.equal(form.elements.topicName.value, '');

    fill(form, { topicName: 'Vue', username: 'Ivo', postText: 'Hi' });
    form.querySelector('.public').click();
    await settle();

    const body = fetch.calls.find((c) => c.method === 'POST').body;
    assert.deepEqual({ ...body, createdOn: undefined }, { title: 'Vue', username: 'Ivo', content: 'Hi', createdOn: undefined });
    assert.deepEqual(topicTitles(document), ['Angular 10', 'Vue']);
});

test('clicking a topic shows its details and only its comments, then a comment can be added', async () => {
    const fetch = forumServer();
    const { document } = await loadPage(page, { fetch });

    document.querySelector('.topic-container a').click();
    await settle();

    assert.equal(document.getElementById('title-post').textContent, 'Angular 10');
    assert.equal(document.getElementById('creator-username').textContent, 'David');
    assert.equal(document.querySelector('.comment .post-content').textContent, 'Lorem');
    const comments = () => [...document.querySelectorAll('#current-post-comments strong')].map((s) => s.textContent);
    assert.deepEqual(comments(), ['Daniel']);

    const form = document.getElementById('create-comment-form');
    fill(form, { postText: 'Agreed', username: 'Mira' });
    form.querySelector('button').click();
    await settle();

    assert.equal(fetch.calls.at(-1).body.postId, 'p1');
    assert.deepEqual(comments(), ['Daniel', 'Mira']);

    document.getElementById('home').click();
    await settle();
    assert.equal(document.getElementById('current-post'), null);
    assert.deepEqual(topicTitles(document), ['Angular 10']);
});
