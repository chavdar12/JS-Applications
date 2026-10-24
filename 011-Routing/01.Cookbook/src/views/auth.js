import { html, nothing } from 'lit-html';
import { login, register } from '../api.js';

const authTemplate = (isRegister, onSubmit) => html`
<article>
    <h2>${isRegister ? 'Register' : 'Login'}</h2>
    <form @submit=${onSubmit}>
        <label>E-mail: <input type="text" name="email"></label>
        <label>Password: <input type="password" name="password"></label>
        ${isRegister ? html`<label>Repeat: <input type="password" name="rePass"></label>` : nothing}
        <input type="submit" value=${isRegister ? 'Register' : 'Login'}>
    </form>
</article>`;

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
