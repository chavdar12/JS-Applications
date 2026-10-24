import { html } from 'lit-html';
import { createIdea } from '../api.js';

const createTemplate = (onSubmit) => html`
<div class="container home wrapper my-md-5 pl-md-5">
    <div class="d-md-flex flex-mb-equal">
        <div class="col-md-6">
            <img class="responsive" src="./images/creativity_painted_face.jpg" alt="">
        </div>
        <form class="form-user col-md-7" @submit=${onSubmit}>
            <div class="text-center mb-4">
                <h1 class="h3 mb-3 font-weight-normal">Share Your Idea</h1>
            </div>
            <div class="form-label-group">
                <label for="ideaTitle">Title</label>
                <input type="text" id="ideaTitle" name="title" class="form-control" placeholder="What is your idea?">
            </div>
            <div class="form-label-group">
                <label for="ideaDescription">Description</label>
                <textarea id="ideaDescription" name="description" class="form-control" placeholder="Description"></textarea>
            </div>
            <div class="form-label-group">
                <label for="inputURL">Add Image</label>
                <input type="text" id="inputURL" name="imageURL" class="form-control" placeholder="Image URL">
            </div>
            <button class="btn btn-lg btn-dark btn-block" type="submit">Create</button>
            <p class="mt-5 mb-3 text-muted text-center">© SoftTerest - 2021.</p>
        </form>
    </div>
</div>`;

export function createPage(ctx) {
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const { title, description, imageURL } = Object.fromEntries(new FormData(e.target));
        try {
            if (title.length < 6) {
                throw new Error('Title must be at least 6 characters long!');
            }
            if (description.length < 10) {
                throw new Error('Description must be at least 10 characters long!');
            }
            if (imageURL.length < 5) {
                throw new Error('Image URL must be at least 5 characters long!');
            }
            await createIdea({ title, description, img: imageURL });
            ctx.page.redirect('/dashboard');
        } catch (err) {
            alert(err.message);
        }
    }
}
