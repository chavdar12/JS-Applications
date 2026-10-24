import { html, render } from 'lit-html';

const tbody = document.querySelector('tbody');
const input = document.getElementById('searchField');
let students = [];

const row = (s, match) => html`
<tr class=${match && [`${s.firstName} ${s.lastName}`, s.email, s.course].some((v) => v.toLowerCase().includes(match)) ? 'select' : ''}>
    <td>${s.firstName} ${s.lastName}</td>
    <td>${s.email}</td>
    <td>${s.course}</td>
</tr>`;

document.getElementById('searchBtn').addEventListener('click', () => {
    update(input.value.trim().toLowerCase());
    input.value = '';
});
loadStudents();

async function loadStudents() {
    const res = await fetch('http://localhost:3030/jsonstore/advanced/table');
    students = Object.values(await res.json());
    update('');
}

function update(match) {
    render(students.map((s) => row(s, match)), tbody);
}
