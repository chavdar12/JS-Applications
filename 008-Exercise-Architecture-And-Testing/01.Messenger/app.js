function attachEvents() {
    const URL = 'http://localhost:3030/jsonstore/messenger';
    const messages = document.getElementById('messages');
    const author = document.getElementById('author');
    const content = document.getElementById('content');

    document.getElementById('submit').addEventListener('click', send);
    document.getElementById('refresh').addEventListener('click', refresh);

    async function send() {
        if (!author.value || !content.value) {
            return;
        }
        await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: author.value, content: content.value })
        });
        content.value = '';
    }

    async function refresh() {
        const res = await fetch(URL);
        const data = await res.json();
        messages.value = Object.values(data).map((m) => `${m.author}: ${m.content}`).join('\n');
    }
}

attachEvents();
