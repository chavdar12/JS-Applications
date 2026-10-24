import { request } from './api.js';

/** Wires the add or edit form. The returned show() pre-fills the form when editing. */
export function setupMovieForm(section, navigate, mode) {
    const form = section.querySelector('form');
    let editing = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { title, description, imageUrl } = Object.fromEntries(new FormData(form));
        if (![title, description, imageUrl].every((v) => v.trim())) {
            alert('All fields are required!');
            return;
        }
        const body = { title, description, img: imageUrl };
        try {
            const movie = mode === 'edit'
                ? await request(`/data/movies/${editing._id}`, 'PUT', body)
                : await request('/data/movies', 'POST', body);
            form.reset();
            navigate('details', movie._id);
        } catch (err) {
            alert(err.message);
        }
    });

    return function showForm(movie) {
        editing = movie;
        if (movie) {
            form.elements.title.value = movie.title;
            form.elements.description.value = movie.description;
            form.elements.imageUrl.value = movie.img;
        }
    };
}
