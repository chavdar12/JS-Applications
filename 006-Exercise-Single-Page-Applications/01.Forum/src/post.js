import { loadComments } from "./comment.js";
import { createHtmlElement } from "./helpers.js";

const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';
const topicContainerElement = document.querySelector('div.topic-container');

export function createPost(e) {
    e.preventDefault();

    const formElement = e.target.parentElement.parentElement;
    const formData = new FormData(formElement);

    const topicName = formData.get('topicName').trim();
    const username = formData.get('username').trim();
    const postText = formData.get('postText').trim();

    if (!topicName || !username || !postText) {
        return alert('All fields are required!');
    }

    const post = {
        topicName,
        username,
        postText,
        createdOn: new Date().toLocaleString(),
    };

    clearCreateTopicFormData(e);

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(post),
    })
        .then(() => getAllPosts())
        .catch((err) => console.error(err));
}

export function clearCreateTopicFormData(e) {
    const form = e.target.parentElement.parentElement;
    form.reset();
}

export function getAllPosts() {
    fetch(url)
        .then((res) => res.json())
        .then((posts) => showPosts(posts))
        .catch((err) => console.error(err));
}

function showPosts(posts) {
    topicContainerElement.innerHTML = '';

    Object.values(posts).forEach((post) => {
        const { createdOn, topicName, username, _id } = post;

        let divElement = createHtmlElement('div', ['topic-name-wrapper']);
        divElement.innerHTML = `<div class="topic-name">
        <a href="javascript:void(0)" class="normal">
            <h2 id=${_id}>${topicName}</h2>
        </a>
        <div class="columns">
            <div>
                <p>Date: <time>${createdOn}</time></p>
                <div class="nick-name">
                    <p>Username: 
                        <span>${username}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>`;

        topicContainerElement.appendChild(divElement);
    });
}

function getCurrentPost(e) {
    document.getElementById('current-post').style.display = 'block';
    document.querySelector('.new-topic-border').style.display = 'none';
    document.querySelector('.topic-title').style.display = 'none';

    const targetPostId = e.target.id;

    fetch(url + `/${targetPostId}`)
        .then((res) => res.json())
        .then((post) => showPost(post))
        .catch((err) => console.error(err));
}

function showPost(post) {
    const { topicName, username, postText, createdOn, _id } = post;

    document.getElementById('title-post').textContent = topicName;
    document.getElementById('title-post').setAttribute('data-id', _id);
    document.getElementById('creator-username').textContent = username;
    document.getElementById('created-on').textContent = createdOn;
    document.querySelector('p.post-content').textContent = postText;

    loadComments(_id);
}