import {showView} from '../src/dom.js';
import {makeRequest} from '../src/requests.js';
import {showHome} from './home.js';

const section = document.getElementById('add-movie');
const form = section.querySelector('form');
form.addEventListener('submit', onCreate);

section.remove();

export function showCreate() {
    showView(section);
}

async function onCreate(ev) {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageUrl = formData.get('imageUrl');

    if (title == '' || description == '' || imageUrl == '') {
        alert('All fields are required');
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData == null) {
        alert('You are not authorized to create a movie.');
        return;
    }

    try {
        const url = 'http://localhost:3030/data/movies';
        const data = {
            title: title,
            description: description,
            img: imageUrl
        };

        const response = await makeRequest(url, 'POST', data, userData.token);
        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Authorization': userData.token
        //     },
        //     body: JSON.stringify({
        //         title: title,
        //         description: description,
        //         img: imageUrl
        //     })
        // });

        if (response.ok != true) {
            const err = await response.json();
            throw new Error(err.message);
        }

        form.reset();
        showHome();
    } catch (error) {
        alert(error.message);
    }
}
