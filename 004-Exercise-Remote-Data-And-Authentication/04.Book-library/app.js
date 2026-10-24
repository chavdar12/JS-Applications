function solve() {
    const URL = 'http://localhost:3030/jsonstore/collections/books';
    const tbody = document.querySelector('tbody');
    const createForm = document.getElementById('submit-form');
    const editForm = document.getElementById('edit-form');
    let editId = null;

    document.getElementById('loadBooks').addEventListener('click', loadBooks);
    createForm.addEventListener('submit', onCreate);
    editForm.addEventListener('submit', onEdit);

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
        for (const text of [book.title, book.author]) {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        }
        const actions = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => startEdit(id, book));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
            await request(`${URL}/${id}`, 'DELETE');
            await loadBooks();
        });
        actions.append(editBtn, deleteBtn);
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

    function startEdit(id, book) {
        editId = id;
        editForm.elements.title.value = book.title;
        editForm.elements.author.value = book.author;
        createForm.style.display = 'none';
        editForm.style.display = 'block';
    }

    async function onEdit(e) {
        e.preventDefault();
        const book = readForm(editForm);
        if (!book) {
            return;
        }
        await request(`${URL}/${editId}`, 'PUT', book);
        editForm.reset();
        editForm.style.display = 'none';
        createForm.style.display = 'block';
        await loadBooks();
    }
}

solve();
