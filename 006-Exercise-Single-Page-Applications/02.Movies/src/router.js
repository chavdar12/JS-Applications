import { renderAddMovie } from './pages/addMoviePage.js';
import { renderHome } from './pages/homePage.js';
import { renderLogin } from './pages/loginPage.js';
import { renderRegister } from './pages/registerPage.js';
import { renderDetailsMovie } from './pages/detailsMoviePage.js';
import { renderEditMovie } from './pages/editMoviePage.js';

const routes = {
    '/': renderHome,
    '/login': renderLogin,
    '/register': renderRegister,
    '/add-movie': renderAddMovie,
    '/details-movie': renderDetailsMovie,
    '/edit-movie': renderEditMovie,
}

export function router(path, id) {
    const renderer = routes[path];
    renderer(id);
}
