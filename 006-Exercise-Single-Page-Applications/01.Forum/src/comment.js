import { createHtmlElement,appendChildren } from "./helpers.js";

const url = 'http://localhost:3030/jsonstore/collections/myboard/comments';
document.getElementById('create-comment-form').addEventListener('submit', createComment);

export function loadComments(postId) {
    fetch(url)
        .then((res) => res.json())
        .then((comments) => showComments(comments, postId))
        .catch((err) => console.error(err));
}

function showComments(comments, postId) {
    const parentDivElement = document.getElementById('current-post-comments');
    parentDivElement.innerHTML = '';

    Object.values(comments)
        .filter((c) => c.postId === postId)
        .forEach((comment) => {
            const { postText, username, createdOn } = comment;

            let divParentElement = createHtmlElement('div', null, '', [{ key: 'id', value: 'user-comment' }]);
            let divTopicNameWrapperParentElement = createHtmlElement('div', ['topic-name-wrapper']);
            let divTopicNameParent = createHtmlElement('div', ['topic-name']);

            let pParentElement = createHtmlElement('p');
            pParentElement.innerHTML = `<strong>${username}</strong> commented on <time>${createdOn}</time>`;

            let divPostContentParentElement = createHtmlElement('div', ['post-content']);
            let pContentElement = createHtmlElement('p', null, `${postText}`);

            appendChildren([pContentElement], divPostContentParentElement);
            appendChildren([pParentElement, divPostContentParentElement], divTopicNameParent);
            appendChildren([divTopicNameParent], divTopicNameWrapperParentElement);
            appendChildren([divTopicNameWrapperParentElement], divParentElement);
            appendChildren([divParentElement], parentDivElement);
        });
}

function createComment(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const postText = formData.get('postText').trim();
    const username = formData.get('username').trim();

    if (!postText || !username) {
        return alert('All fields are required!');
    }

    const postId = document.getElementById('title-post').getAttribute('data-id');

    const comment = {
        postText,
        username,
        createdOn: new Date().toLocaleString(),
        postId,
    };

    e.target.reset();

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(comment),
    })
        .then(() => loadComments(postId))
        .catch((err) => console.error(err));
}