import { html, render } from 'lit-html';
import { contacts } from './contacts.js';

const root = document.getElementById('contacts');
const expanded = new Set();

const contactCard = (contact) => html`
<div class="contact card">
    <div>
        <i class="far fa-user-circle gravatar"></i>
    </div>
    <div class="info">
        <h2>Name: ${contact.name}</h2>
        <button class="detailsBtn" @click=${() => toggle(contact.id)}>Details</button>
        <div class="details" id=${contact.id} style="display: ${expanded.has(contact.id) ? 'block' : 'none'}">
            <p>Phone number: ${contact.phoneNumber}</p>
            <p>Email: ${contact.email}</p>
        </div>
    </div>
</div>`;

function toggle(id) {
    if (!expanded.delete(id)) {
        expanded.add(id);
    }
    update();
}

function update() {
    render(contacts.map(contactCard), root);
}

update();
