import {showView} from '../src/dom.js';
import {makeRequest} from '../src/requests.js';
import {showHome} from './home.js';

const section = document.getElementById('edit-movie');
const form = section.querySelector('form');
section.remove();

export function showEdit(userData, movie) {
    const titleInput = section.querySelector('#title-input');
    titleInput.value = movie.title;

    const descriptionInput = section.querySelector('#description-input');
    descriptionInput.value = movie.description;

    const imgInput = section.querySelector('#image-input');
    imgInput.value = movie.img;

    showView(section);
    form.addEventListener('submit', onEdit);

    async function onEdit(ev) {
        ev.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title');
        const description = formData.get('description');
        const imageUrl = formData.get('imageUrl');

        if (title == '' || description == '' || imageUrl == '') {
            alert('All fields are required');
            return;
        }

        const data = {
            title: title,
            description: description,
            img: imageUrl
        };

        try {
            const url = `http://localhost:3030/data/movies/${movie._id}`;
            const response = await makeRequest(url, 'PUT', data, userData.token);
            // const response = await fetch(url, {
            //     method: 'PUT',
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
}
