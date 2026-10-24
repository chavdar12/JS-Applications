function attachEvents() {
    const URL = 'http://localhost:3030/jsonstore/phonebook';
    const list = document.getElementById('phonebook');
    const person = document.getElementById('person');
    const phone = document.getElementById('phone');

    document.getElementById('btnLoad').addEventListener('click', load);
    document.getElementById('btnCreate').addEventListener('click', create);

    async function load() {
        const res = await fetch(URL);
        const data = await res.json();
        list.replaceChildren(...Object.entries(data).map(([key, entry]) => {
            const li = document.createElement('li');
            li.textContent = `${entry.person}: ${entry.phone}`;
            const btn = document.createElement('button');
            btn.textContent = 'Delete';
            btn.addEventListener('click', () => remove(key));
            li.appendChild(btn);
            return li;
        }));
    }

    async function remove(key) {
        await fetch(`${URL}/${key}`, { method: 'DELETE' });
        await load();
    }

    async function create() {
        if (!person.value || !phone.value) {
            return;
        }
        await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ person: person.value, phone: phone.value })
        });
        person.value = '';
        phone.value = '';
        await load();
    }
}

attachEvents();
