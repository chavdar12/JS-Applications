import { getUser, request } from './api.js';

export function setupDetails(section, navigate) {
    const $ = (selector) => section.querySelector(selector);
    let movie = null;

    $('#delete-btn').addEventListener('click', async () => {
        if (confirm(`Delete ${movie.title}?`)) {
            await request(`/data/movies/${movie._id}`, 'DELETE');
            navigate('home');
        }
    });
    $('#edit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('edit', movie);
    });
    $('#like-btn').addEventListener('click', async () => {
        await request('/data/likes', 'POST', { movieId: movie._id });
        await showDetails(movie._id);
    });

    async function showDetails(id) {
        const user = getUser();
        const where = (query) => `/data/likes?where=${encodeURIComponent(query)}`;
        let ownLikes;
        let likes;
        [movie, likes, ownLikes] = await Promise.all([
            request(`/data/movies/${id}`),
            request(`${where(`movieId="${id}"`)}&distinct=_ownerId&count`),
            user ? request(where(`movieId="${id}" and _ownerId="${user.id}"`)) : []
        ]);
        const isOwner = user?.id === movie._ownerId;

        $('#movie-details-title').textContent = `Movie title: ${movie.title}`;
        $('#movie-details-img').src = movie.img;
        $('#movie-details-description').textContent = movie.description;
        $('#likes').textContent = `Liked ${likes}`;
        $('#delete-btn').style.display = isOwner ? '' : 'none';
        $('#edit-btn').style.display = isOwner ? '' : 'none';
        $('#like-btn').style.display = user && !isOwner && ownLikes.length === 0 ? '' : 'none';
    }

    return showDetails;
}
