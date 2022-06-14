import { clearCreateTopicFormData, createPost, getAllPosts } from "./post.js";

document.querySelector('form#create-post-form button.public').addEventListener('click', createPost);
document.querySelector('form#create-post-form button.cancel').addEventListener('click', clearCreateTopicFormData);
document.getElementById('home').addEventListener('click', showHome);

getAllPosts();

function showHome() {
    document.getElementById('current-post').style.display = 'none';
    document.querySelector('.new-topic-border').style.display = 'block';
    document.querySelector('.topic-title').style.display = 'block';
}
