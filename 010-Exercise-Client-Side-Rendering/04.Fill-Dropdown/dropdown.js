import { html, render } from './node_modules/lit-html/lit-html.js';

const url = 'http://localhost:3030/jsonstore/advanced/dropdown';

const optionCard = (option) => html`
    <option value=${option._id}>${option.text}</option>
`;

const formElement = document.querySelector('form');
formElement.addEventListener('submit', addOption);

getOptions();

function getOptions() {
    fetch(url)
        .then((res) => res.json())
        .then((res) => renderOptions(res))
        .catch((err) => console.error(err));
}

function renderOptions(options) {
    const result = Object.values(options).map((o) => optionCard(o));
    const menuSelectElement = document.getElementById('menu');

    render(result, menuSelectElement);
}

function addOption(e) {
    e.preventDefault();

    const form = e.target;
    const textInputElement = form.querySelector('#itemText');
    const text = textInputElement.value;

    if (!text) {
        return alert('The field is required!');
    }

    const option = {
        text,
    };

    form.reset();
    send(option);
}

function send(option) {
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(option)
    })
        .then(() => getOptions())
        .catch((err) => console.error(err));
}