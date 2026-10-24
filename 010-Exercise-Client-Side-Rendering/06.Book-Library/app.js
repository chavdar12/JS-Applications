import { html, render } from 'lit-html';

const URL = 'http://localhost:3030/jsonstore/collections/books';
let books = [];
let editing = null;

const pageTemplate = () => html`
<button id="loadBooks" @click=${loadBooks}>LOAD ALL BOOKS</button>
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        ${books.map((book) => html`
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>
                <button @click=${() => startEdit(book)}>Edit</button>
                <button @click=${() => onDelete(book._id)}>Delete</button>
            </td>
        </tr>`)}
    </tbody>
</table>
${editing ? editForm(editing) : addForm()}`;

const addForm = () => html`
<form id="add-form" @submit=${onAdd}>
    <h3>Add book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title...">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author...">
    <input type="submit" value="Submit">
</form>`;

const editForm = (book) => html`
<form id="edit-form" @submit=${onSave}>
    <input type="hidden" name="id" .value=${book._id}>
    <h3>Edit book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title..." .value=${book.title}>
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author..." .value=${book.author}>
    <input type="submit" value="Save">
</form>`;

update();

function update() {
    render(pageTemplate(), document.body);
}

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
    const data = await request(URL);
    books = Object.entries(data).map(([_id, book]) => ({ ...book, _id }));
    update();
}

function readForm(form) {
    const { title, author } = Object.fromEntries(new FormData(form));
    return title.trim() && author.trim() ? { title, author } : null;
}

async function onAdd(e) {
    e.preventDefault();
    const book = readForm(e.target);
    if (!book) {
        return;
    }
    await request(URL, 'POST', book);
    e.target.reset();
    await loadBooks();
}

function startEdit(book) {
    editing = book;
    update();
}

async function onSave(e) {
    e.preventDefault();
    const book = readForm(e.target);
    if (!book) {
        return;
    }
    await request(`${URL}/${editing._id}`, 'PUT', book);
    editing = null;
    await loadBooks();
}

async function onDelete(id) {
    await request(`${URL}/${id}`, 'DELETE');
    if (editing?._id === id) {
        editing = null;
    }
    await loadBooks();
}
