function solve() {
    const baseUrl = 'http://localhost:3030/jsonstore/collections/books';

    let loadButtonElement = document.getElementById('loadBooks');
    loadButtonElement.addEventListener('click', loadBooks);

    let createFormElement = document.getElementById('submit-form');
    createFormElement.addEventListener('submit', addBook);

    let editFormElement = document.getElementById('edit-form');
    editFormElement.addEventListener('submit', updateBook);

    function loadBooks() {
        editFormElement.style.display = 'none';
        createFormElement.style.display = 'block';

        fetch(baseUrl)
            .then((res) => res.json())
            .then((books) => createBooks(books))
            .catch((err) => console.error(err));
    }

    function createBooks(books) {
        let tBodyElement = document.querySelector('table tBody');
        tBodyElement.innerHTML = '';

        Object.keys(books).forEach((id) => {
            const { author, title } = books[id];

            let trElement = document.createElement('tr');
            trElement.insertCell(0).textContent = title;
            trElement.insertCell(1).textContent = author;

            let editButtonElement = document.createElement('button');
            editButtonElement.textContent = 'Edit';
            editButtonElement.id = id;
            editButtonElement.addEventListener('click', getBookForUpdate);

            let deleteButtonElement = document.createElement('button');
            deleteButtonElement.textContent = 'Delete';
            deleteButtonElement.id = id;
            deleteButtonElement.addEventListener('click', deleteBook);

            let buttonCellElement = trElement.insertCell(2);

            buttonCellElement.appendChild(editButtonElement);
            buttonCellElement.appendChild(deleteButtonElement);

            tBodyElement.appendChild(trElement)
        });
    }

    function addBook(e) {
        e.preventDefault();

        const book = getFormData(e.target);

        if (!book) {
            return;
        }

        e.target.reset();

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(book),
        })
            .then(() => loadBooks())
            .catch((err) => console.error(err));
    }

    function getBookForUpdate(e) {
        const bookId = e.target.id;

        fetch(baseUrl + `/${bookId}`)
            .then((res) => res.json())
            .then((book) => showEditForm(book, bookId))
            .catch((err) => console.error(err));
    }

    function showEditForm(book, bookId) {
        editFormElement.style.display = 'block';
        createFormElement.style.display = 'none';

        const { title, author } = book;
        editFormElement.children[2].value = title;
        editFormElement.children[4].value = author;
        editFormElement.children[5].id = bookId;
    }

    function updateBook(e) {
        e.preventDefault();

        const updatedBook = getFormData(e.target);

        if (!updatedBook) {
            return;
        }

        const bookId = e.target.children[5].id;

        fetch(baseUrl + `/${bookId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
        })
            .then(() => loadBooks())
            .catch((err) => console.error(err));
    }

    function deleteBook(e) {
        const targetId = e.target.id;

        fetch(baseUrl + `/${targetId}`, {
            method: 'DELETE',
        })
            .then(() => loadBooks())
            .catch((err) => console.error(err));
    }

    function getFormData(form) {
        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const author = formData.get('author').trim();

        if (!title || !author) {
            return alert('All fields are required!');
        }

        const book = {
            title,
            author,
        };

        return book;
    }
}

solve();