function attachEvents() {
    const baseUrl = 'http://localhost:3030/jsonstore/phonebook';

    let loadButtonElement = document.getElementById('btnLoad');
    loadButtonElement.addEventListener('click', getAllContacts);

    let createButtonElement = document.getElementById('btnCreate');
    createButtonElement.addEventListener('click', createContact);

    function createContact() {
        let personInputElement = document.getElementById('person');
        let phoneInputElement = document.getElementById('phone');

        if (!personInputElement.value || !phoneInputElement.value) {
            return alert('All fields are required!');
        }

        const contact = {
            person: personInputElement.value,
            phone: phoneInputElement.value,
        };

        personInputElement.value = '';
        phoneInputElement.value = '';

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'Application/json',
            },
            body: JSON.stringify(contact)
        })
            .then(() => getAllContacts())
            .catch((err) => console.error(err));

    }

    function getAllContacts() {
        fetch(baseUrl)
            .then((res) => res.json())
            .then((contacts) => showContacts(contacts))
            .catch((err) => console.error(err));
    }

    function showContacts(contacts) {
        let phonebookUlElement = document.getElementById('phonebook');
        phonebookUlElement.innerHTML = '';

        Object.values(contacts).forEach((contact) => {
            const { person, phone, _id } = contact;

            let liElement = document.createElement('li');
            liElement.textContent = `${person}: ${phone}`;

            let buttonElement = document.createElement('button');
            buttonElement.id = _id;
            buttonElement.textContent = 'Delete';
            buttonElement.addEventListener('click', deleteContact);

            liElement.appendChild(buttonElement);
            phonebookUlElement.appendChild(liElement);
        });
    }

    function deleteContact(e) {
        const targetId = e.target.id;

        fetch(baseUrl + `/${targetId}`, {
            method: 'Delete',
        })
            .then(() => getAllContacts())
            .catch((err) => console.error(err));
    }
}

attachEvents();