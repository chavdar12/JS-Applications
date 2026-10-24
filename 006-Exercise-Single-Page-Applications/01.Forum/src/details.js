import { get, post } from './api.js';

export function setupDetails(section) {
    const commentsDiv = section.querySelector('#current-post-comments');
    const form = section.querySelector('#create-comment-form');
    const template = section.querySelector('#user-comment');
    template.remove();
    template.removeAttribute('id');
    let postId = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { postText, username } = Object.fromEntries(new FormData(form));
        if (!postText.trim() || !username.trim()) {
            alert('All fields are required!');
            return;
        }
        const comment = await post('comments', { text: postText, username, postId, createdOn: new Date().toISOString() });
        commentsDiv.appendChild(createComment(comment));
        form.reset();
    });

    function createComment(comment) {
        const el = template.cloneNode(true);
        el.querySelector('strong').textContent = comment.username;
        el.querySelector('time').textContent = new Date(comment.createdOn).toLocaleString();
        el.querySelector('.post-content p').textContent = comment.text;
        return el;
    }

    return async function showDetails(id) {
        postId = id;
        const [topic, comments] = await Promise.all([get(`posts/${id}`), get('comments')]);

        section.querySelector('#title-post').textContent = topic.title;
        section.querySelector('#creator-username').textContent = topic.username;
        section.querySelector('#created-on').textContent = topic.createdOn;
        section.querySelector('.comment .post-content').textContent = topic.content;
        commentsDiv.replaceChildren(...Object.values(comments).filter((c) => c.postId === id).map(createComment));
    };
}
