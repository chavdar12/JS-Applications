import { getUserData, checkPath, hideAllSections } from '../utils.js';

const url = 'http://localhost:3030/data/movies';

export function renderHome() {
    hideAllSections();
    getAllMovies();
    document.getElementById('home').style.display = 'block';
}

export function getAllMovies() {
    fetch(url)
        .then((res) => res.json())
        .then((movies) => showMovies(movies))
        .catch((err) => console.error(err));
}

function showMovies(movies) {
    const movieContainer = document.getElementById('movies-container');
    const exampleMovieElement = document.querySelector('div.current-movie');
    movieContainer.innerHTML = '';

    const user = getUserData();

    movies.forEach((movie) => {
        const { img, title, _id } = movie;

        const clonedMovieElement = exampleMovieElement.cloneNode(true);

        clonedMovieElement.children[0].src = img;
        clonedMovieElement.children[1].children[0].textContent = title;
        clonedMovieElement.children[2].children[0].children[0].id = _id;
        clonedMovieElement.children[2].children[0].children[0].addEventListener('click', checkPath);
        clonedMovieElement.children[2].children[0].children[0].style.display = user ? 'block' : 'none';

        movieContainer.appendChild(clonedMovieElement);
    });
}