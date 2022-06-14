import {e, showView} from '../src/dom.js';
import {showHome} from './home.js';
import {showEdit} from './edit.js';
import {makeRequest} from '../src/requests.js';

const section = document.getElementById('movie-example');
section.remove();

export function showDetails(movieId) {
    showView(section);
    getMovie(movieId);
}

async function getMovie(movieId) {
    section.replaceChildren(e('p', {}, 'Loading...'));

    const movieUrl = 'http://localhost:3030/data/movies/' + movieId;
    const likesUrl = `http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`;

    const requests = [fetch(movieUrl), fetch(likesUrl)];
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData != null) {
        const hasLikedUrl = `http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userData.id}%22`;
        requests.push(fetch(hasLikedUrl));
    }

    const [movieResponse, likesResponse, hasLikedResponse] = await Promise.all(requests);

    const [movieData, likesData, hasLiked] = await Promise.all([
        movieResponse.json(),
        likesResponse.json(),
        hasLikedResponse && hasLikedResponse.json()
    ]);

    section.replaceChildren(createDetails(movieData, likesData, hasLiked));
}

function createDetails(movie, likes, hasLiked) {
    const controls = e('div', {className: 'col-md-4 text-center'},
        e('h3', {className: 'my-3'}, 'Movie Description'),
        e('p', {}, movie.description)
    );

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        if (userData.id == movie._ownerId) {
            controls.appendChild(e('a', {className: 'btn btn-danger', href: '#', onClick: onDelete}, 'Delete'));
            controls.appendChild(e('a', {className: 'btn btn-warning', href: '#', onClick: onEdit}, 'Edit'));
        } else {
            if (hasLiked.length > 0) {
                controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onClick: onUnlike}, 'Unlike'));
            } else {
                controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onClick: onLike}, 'Like'));
            }
        }

        controls.appendChild(e('span', {className: 'enrolled-span'}, `Liked ${likes}`));
    }

    const element = e('div', {className: 'container'},
        e('div', {className: 'row bg-light text-dark'},
            e('h1', {}, `Movie title: ${movie.title}`),
            e('div', {className: 'col-md-8'},
                e('img', {className: 'img-thumbnail', src: movie.img, alt: 'Movie'})
            ),
            controls
        )
    );

    return element;

    function onEdit() {
        if (userData.id != movie._ownerId) {
            alert('You are not authorized');
            return;
        }

        showEdit(userData, movie);
    }

    async function onDelete() {
        if (userData.id != movie._ownerId) {
            alert('You are not authorized');
            return;
        }

        const url = `http://localhost:3030/data/movies/${movie._id}`;
        const response = await makeRequest(url, 'DELETE', {}, userData.token);
        // const response = await fetch(url, {
        //     method: 'DELETE',
        //     headers: {
        //         'X-Authorization': userData.token
        //     }
        // });

        showHome();
    }

    async function onLike() {
        const url = 'http://localhost:3030/data/likes';
        const data = {movieId: movie._id};
        const response = await makeRequest(url, 'POST', data, userData.token);

        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Authorization': userData.token
        //     },
        //     body: JSON.stringify({
        //         movieId: movie._id
        //     })
        // });

        showDetails(movie._id);
    }

    async function onUnlike() {
        const likeId = hasLiked[0]._id;
        const url = `http://localhost:3030/data/likes/${likeId}`;
        const response = await makeRequest(url, 'DELETE', {}, userData.token);
        // const response = await fetch(url, {
        //     method: 'DELETE',
        //     headers: {
        //         'X-Authorization': userData.token
        //     }
        // });

        showDetails(movie._id);
    }
}
