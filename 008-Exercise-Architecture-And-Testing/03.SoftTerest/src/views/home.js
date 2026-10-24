import { html } from 'lit-html';

const homeTemplate = () => html`
<div class="container home wrapper my-md-5 pl-md-5">
    <div class="d-md-flex flex-mb-equal">
        <div class="col-md-6">
            <img class="responsive-ideas create" src="./images/creativity_painted_face.jpg" alt="">
        </div>
        <div class="home-text col-md-6">
            <h2 class="featurette-heading">Do you wonder if your idea is good?</h2>
            <p class="lead">Join our family =)</p>
            <p class="lead">Post your ideas!</p>
            <p class="lead">Find what other people think!</p>
            <p class="lead">And this is all completely free!</p>
            <a class="btn btn-secondary btn-lg mt-4" href="/register">Get Started</a>
        </div>
    </div>
</div>`;

export function homePage(ctx) {
    ctx.render(homeTemplate());
}
