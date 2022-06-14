import {e, showView} from '../src/dom.js';
import {makeRequest} from '../src/requests.js';
import {showCreate} from '../views/create.js';
import {showDetails} from '../views/details.js';

const section = document.getElementById('home-page');
const catalog = section.querySelector('.card-deck.d-flex.justify-content-center');
section.querySelector('#create-link').addEventListener('click', (ev) => {
    ev.preventDefault();
    showCreate();
});

catalog.addEventListener('click', (ev) => {
    ev.preventDefault();
    let target = ev.target;
    if (target.tagName == 'BUTTON') {
        target = target.parentElement;
    }

    if (target.tagName == 'A') {
        const id = target.dataset.id;

        showDetails(id);
    }
});

section.remove();

export function showHome() {
    showView(section);
    const userData = sessionStorage.getItem('userData');
    if (userData) {
        document.querySelector('#add-movie-button').style.display = 'block';
    } else {
        document.querySelector('#add-movie-button').style.display = 'none';
    }
    getMovies();
}

export async function getMovies() {
    catalog.replaceChildren(e('p', {}, 'Loading...'));

    const url = 'http://localhost:3030/data/movies';
    const response = await makeRequest(url);
    //const response = await fetch(url);

    const data = await response.json();

    catalog.replaceChildren(...data.map(createMovieCard));
}

function createMovieCard(movie) {
    const cardElement = e('div', {className: 'card mb-4'});
    const img = e('img', {className: 'card-img-top'});
    img.src = movie.img;
    img.alt = 'Card image cap';
    img.width = 400;

    const divCard = e('div', {className: 'card-body'});
    const h4 = e('h4', {className: 'card-title'});
    h4.textContent = movie.title;
    divCard.appendChild(h4);

    const divFooter = e('div', {className: 'card-footer'});
    const a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-id', movie._id);
    const btn = e('button', {className: 'btn btn-info'});
    btn.type = 'button';
    btn.textContent = 'Details';
    a.appendChild(btn);
    divFooter.appendChild(a);

    cardElement.appendChild(img);
    cardElement.appendChild(divCard);
    cardElement.appendChild(divFooter);

    return cardElement;
}
