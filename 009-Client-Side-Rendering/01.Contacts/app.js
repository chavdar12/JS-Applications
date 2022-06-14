import { html, render } from './node_modules/lit-html/lit-html.js';
import { contacts } from './contacts.js';

const contactCard = (contact, onToggle) => html`
    <div class="contact card">
        <div>
            <i class="far fa-user-circle gravatar"></i>
        </div>
        <div class="info">
            <h2>Name: ${contact.name}</h2>
            <button @click=${onToggle} class="detailsBtn">Details</button>
            <div class="details" id=${contact.id}>
                <p>Phone number: ${contact.phoneNumber}</p>
                <p>Email: ${contact.email}</p>
            </div>
        </div>
    </div>
`;

renderContacts();

function renderContacts() {
    const result = contacts.map((c) => contactCard(c, onToggle));
    const contactsDivElement = document.getElementById('contacts');

    render(result, contactsDivElement);
}

function onToggle(e) {
    const targetContact = e.target.parentElement.children[2];
    targetContact.style.display = targetContact.style.display === 'block' ? 'none' : 'block';
}