import { html, nothing } from 'lit-html';
import { login, register } from '../api.js';

const authTemplate = (isRegister, onSubmit) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>${isRegister ? 'Register New User' : 'Login User'}</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="email">Email</label>
                <input class="form-control" id="email" type="text" name="email">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="password">Password</label>
                <input class="form-control" id="password" type="password" name="password">
            </div>
            ${isRegister ? html`
            <div class="form-group">
                <label class="form-control-label" for="rePass">Repeat</label>
                <input class="form-control" id="rePass" type="password" name="rePass">
            </div>` : nothing}
            <input type="submit" class="btn btn-primary" value=${isRegister ? 'Register' : 'Login'} />
        </div>
    </div>
</form>`;

function authPage(isRegister) {
    return (ctx) => {
        ctx.render(authTemplate(isRegister, onSubmit));

        async function onSubmit(e) {
            e.preventDefault();
            const { email, password, rePass } = Object.fromEntries(new FormData(e.target));
            try {
                if (!email || !password) {
                    throw new Error('All fields are required!');
                }
                if (isRegister) {
                    if (password !== rePass) {
                        throw new Error('Passwords don\'t match!');
                    }
                    await register(email, password);
                } else {
                    await login(email, password);
                }
                ctx.page.redirect('/');
            } catch (err) {
                alert(err.message);
            }
        }
    };
}

export const loginPage = authPage(false);
export const registerPage = authPage(true);
