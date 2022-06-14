import { getUserData, hideAllSections } from '../utils.js';
import { renderHome } from './homePage.js';

const url = 'http://localhost:3030/data/movies';
document.getElementById('add-movie-form').addEventListener('submit', addMovie);

export function renderAddMovie() {
    hideAllSections();
    document.getElementById('add-movie').style.display = 'block';
}

function addMovie(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageUrl = formData.get('imageUrl').trim();

    if (!title || !description || !imageUrl) {
        return alert('All fields are required!');
    }

    const movie = {
        title,
        description,
        img: imageUrl,
    };

    e.target.reset();

    const userToken = getUserData().accessToken;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(movie),
    })
        .then(() => hideAllSections())
        .then(() => renderHome())
        .catch((err) => console.error(err));
}
