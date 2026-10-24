import { html, nothing } from 'lit-html';
import { login, register } from '../api.js';

const authTemplate = (isRegister, onSubmit) => html`
<div class="container home wrapper my-md-5 pl-md-5">
    <div class="row-form d-md-flex flex-mb-equal">
        <div class="col-md-4">
            <img class="responsive" src="./images/idea.png" alt="">
        </div>
        <form class="form-user col-md-7" @submit=${onSubmit}>
            <div class="text-center mb-4">
                <h1 class="h3 mb-3 font-weight-normal">${isRegister ? 'Register' : 'Login'}</h1>
            </div>
            <div class="form-label-group">
                <label for="inputEmail">Email</label>
                <input type="text" id="inputEmail" name="email" class="form-control" placeholder="Email">
            </div>
            <div class="form-label-group">
                <label for="inputPassword">Password</label>
                <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password">
            </div>
            ${isRegister ? html`
            <div class="form-label-group">
                <label for="inputRepeatPassword">Repeat Password</label>
                <input type="password" id="inputRepeatPassword" name="repeatPassword" class="form-control"
                    placeholder="Repeat Password">
            </div>` : nothing}
            <button class="btn btn-lg btn-dark btn-block" type="submit">${isRegister ? 'Sign Up' : 'Sign In'}</button>
            <div class="text-center mb-4">
                <p class="alreadyUser">
                    ${isRegister
                        ? html`Already have account? Then just <a href="/login">Sign-In</a>!`
                        : html`Don't have account? Then just <a href="/register">Sign-Up</a>!`}
                </p>
            </div>
            <p class="mt-5 mb-3 text-muted text-center">© SoftTerest - 2021.</p>
        </form>
    </div>
</div>`;

function authPage(isRegister) {
    return (ctx) => {
        ctx.render(authTemplate(isRegister, onSubmit));

        async function onSubmit(e) {
            e.preventDefault();
            const { email, password, repeatPassword } = Object.fromEntries(new FormData(e.target));
            try {
                if (isRegister) {
                    if (email.length < 3 || password.length < 3) {
                        throw new Error('Email and password must be at least 3 characters long!');
                    }
                    if (password !== repeatPassword) {
                        throw new Error('Passwords don\'t match!');
                    }
                    await register(email, password);
                } else {
                    await login(email, password);
                }
                ctx.updateNav();
                ctx.page.redirect('/');
            } catch (err) {
                alert(err.message);
            }
        }
    };
}

export const loginPage = authPage(false);
export const registerPage = authPage(true);
