function attachEvents() {
    const baseUrl = 'http://localhost:3030/jsonstore/blog/';
    let postBodies = {};

    let loadPostsButtonElement = document.getElementById('btnLoadPosts');
    loadPostsButtonElement.addEventListener('click', loadPosts);

    let viewPostButtonElement = document.getElementById('btnViewPost');
    viewPostButtonElement.addEventListener('click', searchSelectedPost);

    let postsSelectElement = document.getElementById('posts');

    function loadPosts() {
        fetch(baseUrl + 'posts')
            .then((res) => res.json())
            .then((data) => loadOptions(data))
            .catch((err) => console.error(err));
    }

    function loadOptions(data) {
        postsSelectElement.innerHTML = '';

        Object.keys(data).forEach((postId) => {
            const { id, title, body } = data[postId];

            let optionElement = document.createElement('option');
            optionElement.value = id;
            optionElement.textContent = title;

            postsSelectElement.appendChild(optionElement);
            postBodies[id] = body;
        });
    }

    function searchSelectedPost() {
        Array.from(postsSelectElement.children).forEach((child) => {
            const isSelected = child.selected;

            if (isSelected) {
                loadComments(child);
            }
        });
    }

    function loadComments(child) {
        const postId = child.value;
        const postTitle = child.textContent;

        fetch(baseUrl + 'comments')
            .then((res) => res.json())
            .then((data) => showPost(data, postId, postTitle))
            .catch((err) => console.error(err));
    }

    function showPost(allComments, postId, postTitle) {
        const filteredComments = Object.values(allComments).filter((x) => x.postId === postId);

        let postTitleH1Element = document.getElementById('post-title');
        postTitleH1Element.textContent = `${postTitle}`;

        let postBodyUlElement = document.getElementById('post-body');
        postBodyUlElement.textContent = postBodies[postId];

        let postCommentsUlElement = document.getElementById('post-comments');
        postCommentsUlElement.innerHTML = '';

        filteredComments.forEach((comment) => {
            const id = comment.id;
            const text = comment.text;

            let liElement = document.createElement('li');
            liElement.id = id;
            liElement.textContent = text;

            postCommentsUlElement.appendChild(liElement);
        });
    }
}

attachEvents();