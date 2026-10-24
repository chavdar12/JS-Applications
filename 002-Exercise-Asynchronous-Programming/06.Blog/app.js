function attachEvents() {
    const BASE_URL = 'http://localhost:3030/jsonstore/blog';
    const select = document.getElementById('posts');
    const title = document.getElementById('post-title');
    const body = document.getElementById('post-body');
    const comments = document.getElementById('post-comments');

    document.getElementById('btnLoadPosts').addEventListener('click', loadPosts);
    document.getElementById('btnViewPost').addEventListener('click', viewPost);

    async function loadPosts() {
        const res = await fetch(`${BASE_URL}/posts`);
        const posts = Object.values(await res.json());
        select.replaceChildren(...posts.map((p) => new Option(p.title, p.id)));
    }

    async function viewPost() {
        const postId = select.value;
        if (!postId) {
            return;
        }
        const [post, allComments] = await Promise.all([
            fetch(`${BASE_URL}/posts/${postId}`).then((r) => r.json()),
            fetch(`${BASE_URL}/comments`).then((r) => r.json())
        ]);

        title.textContent = post.title;
        body.textContent = post.body;
        comments.replaceChildren(...Object.values(allComments)
            .filter((c) => c.postId === postId)
            .map((c) => {
                const li = document.createElement('li');
                li.id = c.id;
                li.textContent = c.text;
                return li;
            }));
    }
}

attachEvents();
