import { getUserData } from '../utils.js';

const baseUrl = 'http://localhost:3030/data/catches';

document.querySelector('button.load').addEventListener('click', getCatches);
document.querySelector('form#addForm button.add').addEventListener('click', createCatch);

let mainElement = document.querySelector('fieldset#main');

export function renderHome() {
    document.getElementById('home-view').style.display = 'block';
    mainElement.style.display = 'none';
}

function getCatches() {
    fetch(baseUrl)
        .then((res) => res.json())
        .then((catches) => showAllCatches(catches))
        .catch((err) => console.error(err));
}

function showAllCatches(catches) {
    mainElement.style.display = 'inline';

    let catchesDivParentElement = document.getElementById('catches');
    let exampleCatchDivElement = catchesDivParentElement.querySelector('div.catch');

    catchesDivParentElement.innerHTML = '';

    const userId = getUserData()?._id;

    catches.forEach((curr) => {
        const { angler, bait, captureTime, location, species, weight, _id, _ownerId } = curr;

        let clonedDivElement = exampleCatchDivElement.cloneNode(true);

        clonedDivElement.children[1].value = angler;
        clonedDivElement.children[3].value = weight;
        clonedDivElement.children[5].value = species;
        clonedDivElement.children[7].value = location;
        clonedDivElement.children[9].value = bait;
        clonedDivElement.children[11].value = captureTime;
        clonedDivElement.children[12].setAttribute('data-id', _id);
        clonedDivElement.children[12].addEventListener('click', updateCatch);
        clonedDivElement.children[13].setAttribute('data-id', _id);
        clonedDivElement.children[13].addEventListener('click', deleteCatch);

        if (!userId || _ownerId !== userId) {
            clonedDivElement.children[12].disabled = true;
            clonedDivElement.children[13].disabled = true;
        } else {
            clonedDivElement.children[12].disabled = false;
            clonedDivElement.children[13].disabled = false;
        }

        catchesDivParentElement.appendChild(clonedDivElement);
    });
}

function createCatch(e) {
    e.preventDefault();
    const form = e.target.parentElement.parentElement;

    const formData = new FormData(form);
    const angler = formData.get('angler').trim();
    const weight = formData.get('weight').trim();
    const species = formData.get('species').trim();
    const location = formData.get('location').trim();
    const bait = formData.get('bait').trim();
    const captureTime = formData.get('captureTime').trim();

    if (!angler || !weight || !species || !location || !bait || !captureTime) {
        return alert('All fields are required!');
    }

    const newCatch = {
        angler,
        weight,
        species,
        location,
        bait,
        captureTime,
    };

    form.reset();

    const userToken = getUserData().accessToken;

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(newCatch)
    })
        .then(() => getCatches())
        .catch((err) => consolee.error(err));
}

function updateCatch(e) {
    const targetId = e.target.getAttribute('data-id');
    const targetCatch = e.target.parentElement;

    const angler = targetCatch.children[1].value.trim();
    const weight = targetCatch.children[3].value.trim();
    const species = targetCatch.children[5].value.trim();
    const location = targetCatch.children[7].value.trim();
    const bait = targetCatch.children[9].value.trim();
    const captureTime = targetCatch.children[11].value.trim();

    if (!angler || !weight || !species || !location || !bait || !captureTime) {
        return alert('All fields are required!');
    }

    const userToken = getUserData().accessToken;

    const updatedCatch = {
        angler,
        weight,
        species,
        location,
        bait,
        captureTime,
    };

    fetch(baseUrl + `/${targetId}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'x-authorization': userToken,
        },
        body: JSON.stringify(updatedCatch)
    })
        .then(() => getCatches())
        .catch((err) => console.error(err));
}

function deleteCatch(e) {
    const targetId = e.target.getAttribute('data-id');
    const userToken = getUserData().accessToken;

    fetch(baseUrl + `/${targetId}`, {
        method: 'DELETE',
        headers: {
            'x-authorization': userToken,
        },
    })
        .then(() => getCatches())
        .catch((err) => consolee.error(err));
}