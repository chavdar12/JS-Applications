import { getUserData, checkPath, hideAllSections } from '../utils.js';
import { renderHome } from './homePage.js';

const baseUrl = 'http://localhost:3030/data/';

export function renderDetailsMovie(id) {
    fetch(baseUrl + `movies/${id}`)
        .then((res) => res.json())
        .then((movie) => showMovieDetails(movie))
        .catch((err) => console.error(err));
}

function showMovieDetails(movie) {
    hideAllSections();
    
    const { title, img, description, _id, _ownerId } = movie;
    const movieElement = document.getElementById('movie-example');
    movieElement.style.display = 'block';

    document.getElementById('movie-details-title').textContent = title;
    document.getElementById('movie-details-description').textContent = description;
    document.getElementById('movie-details-img').src = img;

    const userId = getUserData()._id;

    if (userId === _ownerId) {
        document.getElementById('delete-btn').style.display = 'inline';
        document.getElementById('edit-btn').style.display = 'inline';
        document.getElementById('like-btn').style.display = 'none';

        document.getElementById('delete-btn').setAttribute('data-id', _id);
        document.getElementById('delete-btn').addEventListener('click', deleteMovie);

        document.getElementById('edit-btn').setAttribute('data-id', _id);
        document.getElementById('edit-btn').addEventListener('click', checkPath);

        getLikesCount(_id);
    } else {
        document.getElementById('delete-btn').style.display = 'none';
        document.getElementById('edit-btn').style.display = 'none';

        getAllLikes(userId, _id);
    }
}

function deleteMovie(e) {
    const confirmation = confirm('Are you sure?');

    if (confirmation) {
        const movieId = e.target.getAttribute('data-id');
        const userToken = getUserData().accessToken;

        fetch(baseUrl + `movies/${movieId}`, {
            method: 'DELETE',
            headers: {
                'x-authorization': userToken,
            }
        })
            .then(() => hideAllSections())
            .then(() => renderHome())
            .catch((err) => console.error(err));
    }
}

function getLikesCount(movieId) {
    fetch(baseUrl + `likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`)
        .then((res) => res.json())
        .then((likes) => showLikesCount(likes))
        .catch((err) => console.error(err));
}

function showLikesCount(likes) {
    document.getElementById('likes').style.display = 'inline';
    document.getElementById('likes').textContent = `Liked ${likes}`;
}

function getAllLikes(userId, movieId) {
    fetch(baseUrl + `likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22`)
        .then((res) => res.json())
        .then((likes) => showLikeButton(likes, movieId))
        .catch((err) => console.error(err));
}

function showLikeButton(likes, movieId) {
    const user = getUserData();

    if (!likes.some((x) => x._ownerId === user._id)) {
        document.getElementById('like-btn').style.display = 'inline';
        document.getElementById('like-btn').addEventListener('click', likeMovie);
        document.getElementById('like-btn').setAttribute('data-id', movieId);
        document.getElementById('likes').style.display = 'none';
    } else {
        document.getElementById('like-btn').style.display = 'none';
        getLikesCount(movieId);
    }
}

function likeMovie(e) {
    e.preventDefault();

    const movieId = e.target.getAttribute('data-id');

    const like = {
        movieId,
    };

    const userToken = getUserData().accessToken;

    fetch(baseUrl + 'likes', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(like),
    })
        .then(() => renderDetailsMovie(movieId))
        .catch((err) => console.error(err));
}