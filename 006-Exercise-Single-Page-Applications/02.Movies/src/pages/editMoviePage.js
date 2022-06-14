import { getUserData, hideAllSections } from '../utils.js';
import { renderDetailsMovie } from './detailsMoviePage.js';

const url = 'http://localhost:3030/data/movies/';
document.getElementById('edit-movie-form').addEventListener('submit', editMovie);

export function renderEditMovie(id) {
    hideAllSections();
    
    getMovie(id);
    document.getElementById('edit-movie').style.display = 'block';
}

function getMovie(id) {
    fetch(url + id)
        .then((res) => res.json())
        .then((movie) => showMovie(movie))
        .catch((err) => console.error(err));
}

function showMovie(movie) {
    const { _id, title, img, description } = movie;

    document.querySelector('form#edit-movie-form input#title').value = title;
    document.querySelector('form#edit-movie-form textarea').value = description;
    document.querySelector('form#edit-movie-form input#imageUrl').value = img;
    document.querySelector('form#edit-movie-form button').id = _id;
}

function editMovie(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const img = formData.get('imageUrl').trim();

    if (!title || !description || !img) {
        return alert('All fields are required!');
    }

    const updatedMovie = {
        title,
        description,
        img,
    };

    const movieId = e.target.children[4].id;
    const userToken = getUserData().accessToken;

    fetch(url + movieId, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(updatedMovie),
    })
        .then(() => hideAllSections())
        .then(() => renderDetailsMovie(movieId))
        .catch((err) => console.error(err));
}