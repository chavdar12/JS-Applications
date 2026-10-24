function solve() {
    const URL = 'http://localhost:3030/jsonstore/collections/students';
    const tbody = document.querySelector('#results tbody');
    const form = document.getElementById('form');
    const notification = form.querySelector('.notification');

    form.addEventListener('submit', onSubmit);
    loadStudents();

    async function loadStudents() {
        const res = await fetch(URL);
        const data = await res.json();
        tbody.replaceChildren(...Object.values(data).map(createRow));
    }

    function createRow({ firstName, lastName, facultyNumber, grade }) {
        const tr = document.createElement('tr');
        for (const value of [firstName, lastName, facultyNumber, Number(grade).toFixed(2)]) {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        }
        return tr;
    }

    async function onSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const grade = Number(data.grade);

        if (Object.values(data).some((v) => v.trim() === '') || Number.isNaN(grade)) {
            notification.textContent = 'All fields are required and grade must be a number!';
            return;
        }
        notification.textContent = '';

        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, grade })
        });
        tbody.appendChild(createRow(await res.json()));
        form.reset();
    }
}

solve();
