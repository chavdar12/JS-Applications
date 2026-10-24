function solve() {
    const URL = 'http://localhost:3030/jsonstore/collections/books';
    const tbody = document.querySelector('tbody');
    const createForm = document.getElementById('createForm');
    const editForm = document.getElementById('editForm');

    document.getElementById('loadBooks').addEventListener('click', loadBooks);
    createForm.addEventListener('submit', onCreate);
    editForm.addEventListener('submit', onSave);
    tbody.addEventListener('click', onTableClick);

    async function request(url, method = 'GET', body) {
        const options = { method, headers: {} };
        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
        const res = await fetch(url, options);
        return res.json();
    }

    async function loadBooks() {
        const books = await request(URL);
        tbody.replaceChildren(...Object.entries(books).map(([id, book]) => createRow(id, book)));
    }

    function createRow(id, book) {
        const tr = document.createElement('tr');
        tr.dataset.id = id;
        for (const text of [book.title, book.author]) {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        }
        const actions = document.createElement('td');
        actions.innerHTML = '<button class="editBtn">Edit</button><button class="deleteBtn">Delete</button>';
        tr.appendChild(actions);
        return tr;
    }

    function readForm(form) {
        const { title, author } = Object.fromEntries(new FormData(form));
        return title.trim() && author.trim() ? { title, author } : null;
    }

    async function onCreate(e) {
        e.preventDefault();
        const book = readForm(createForm);
        if (!book) {
            return;
        }
        await request(URL, 'POST', book);
        createForm.reset();
        await loadBooks();
    }

    async function onTableClick(e) {
        const id = e.target.closest('tr')?.dataset.id;
        if (e.target.classList.contains('editBtn')) {
            const book = await request(`${URL}/${id}`);
            editForm.elements.id.value = id;
            editForm.elements.title.value = book.title;
            editForm.elements.author.value = book.author;
            createForm.style.display = 'none';
            editForm.style.display = 'block';
        } else if (e.target.classList.contains('deleteBtn')) {
            await request(`${URL}/${id}`, 'DELETE');
            await loadBooks();
        }
    }

    async function onSave(e) {
        e.preventDefault();
        const book = readForm(editForm);
        if (!book) {
            return;
        }
        await request(`${URL}/${editForm.elements.id.value}`, 'PUT', book);
        editForm.reset();
        editForm.style.display = 'none';
        createForm.style.display = 'block';
        await loadBooks();
    }
}

solve();
