import { get, post } from './api.js';

export function setupHome([formWrapper, topicList], navigate) {
    const form = formWrapper.querySelector('form');
    // the skeleton's sample topic doubles as the template for real ones
    const template = topicList.querySelector('.topic-container');
    template.remove();

    form.addEventListener('submit', onSubmit);
    topicList.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-id]');
        if (link) {
            navigate('details', link.dataset.id);
        }
    });

    async function onSubmit(e) {
        e.preventDefault();
        if (e.submitter?.classList.contains('cancel')) {
            form.reset();
            return;
        }
        const { topicName, username, postText } = Object.fromEntries(new FormData(form));
        if (![topicName, username, postText].every((v) => v.trim())) {
            alert('All fields are required!');
            return;
        }
        await post('posts', { title: topicName, username, content: postText, createdOn: new Date().toISOString() });
        form.reset();
        await showHome();
    }

    function createTopic(topic) {
        const el = template.cloneNode(true);
        const link = el.querySelector('a');
        link.dataset.id = topic._id;
        link.querySelector('h2').textContent = topic.title;
        el.querySelector('time').textContent = topic.createdOn;
        el.querySelector('.nick-name span').textContent = topic.username;
        return el;
    }

    async function showHome() {
        const posts = await get('posts');
        topicList.replaceChildren(...Object.values(posts).map(createTopic));
    }

    return showHome;
}
