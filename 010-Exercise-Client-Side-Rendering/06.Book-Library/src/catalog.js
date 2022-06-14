import {deleteBook, getBooks} from './api.js';
import {html, until} from './utility.js';

const catalogTemplate = (booksPromise) => html`
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        ${until(booksPromise, html`<tr>
            <td colSpan="3">Loading&hellip;</td>
        </tr>`)}
    </tbody>
</table>`;

const bookRow = (book, onEdit, onDelete) => html`
<tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>
        <button @click=${onEdit}>Edit</button>
        <button @click=${onDelete}>Delete</button>
    </td>
</tr>`;

export function showCatalog(context) {
    return catalogTemplate(loadBooks(context));
}

async function loadBooks(context) {
    const data = await getBooks();

    const books = Object.entries(data).map(([k, v]) => Object.assign(v, {_id: k}));

    return Object.values(books).map(book => bookRow(book, toggleEditor.bind(null, book, context), onDelete.bind(null, book._id, context)));
}

function toggleEditor(book, context) {
    context.book = book;
    context.update();
}

async function onDelete(id, context) {
    await deleteBook(id);
    context.update();
}
