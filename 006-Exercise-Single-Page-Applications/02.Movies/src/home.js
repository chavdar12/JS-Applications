import { getUser, request } from './api.js';

export function setupHome(section, navigate) {
    const container = section.querySelector('#movies-container');
    // the skeleton's sample card doubles as the template for real ones
    const template = container.querySelector('.card');
    template.remove();

    container.addEventListener('click', (e) => {
        const link = e.target.closest('.movie-details');
        if (link) {
            navigate('details', link.dataset.id);
        }
    });

    function createCard(movie) {
        const card = template.cloneNode(true);
        card.querySelector('img').src = movie.img;
        card.querySelector('.card-title').textContent = movie.title;
        card.querySelector('.movie-details').dataset.id = movie._id;
        return card;
    }

    return async function showHome() {
        section.querySelector('#add-movie-button').style.display = getUser() ? '' : 'none';
        const movies = await request('/data/movies');
        container.replaceChildren(...movies.map(createCard));
    };
}
