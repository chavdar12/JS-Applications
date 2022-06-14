function attachEvents() {
    const baseUrl = 'http://localhost:3030/jsonstore/messenger';

    let submitButtonElement = document.getElementById('submit');
    submitButtonElement.addEventListener('click', createMessage);

    let refreshButtonElement = document.getElementById('refresh');
    refreshButtonElement.addEventListener('click', getAllMessages);

    function createMessage() {
        let nameInputElement = document.querySelector('input[name="author"]');
        let contentInputElement = document.querySelector('input[name="content"]');

        if (!nameInputElement.value || !contentInputElement.value) {
            return alert('All fields are required!');
        }

        const message = {
            author: nameInputElement.value,
            content: contentInputElement.value,
        };

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then(() => getAllMessages())
            .catch((err) => console.error(err));

        nameInputElement.value = '';
        contentInputElement.value = '';
    }

    function getAllMessages() {
        fetch(baseUrl)
            .then((res) => res.json())
            .then((messages) => showAllMessages(messages))
            .catch((err) => console.error(err));
    }

    function showAllMessages(messages) {
        let textAreaElement = document.getElementById('messages');
        textAreaElement.value = '';

        Object.values(messages).forEach((message) => {
            const { author, content } = message;
            textAreaElement.value += `${author}: ${content}\n`;
        });

        textAreaElement.value = textAreaElement.value.trimEnd();
    }
}

attachEvents();