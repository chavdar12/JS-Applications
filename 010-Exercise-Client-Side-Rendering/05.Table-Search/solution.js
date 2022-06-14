import { html, render } from './node_modules/lit-html/lit-html.js';

const url = 'http://localhost:3030/jsonstore/advanced/table';

const rowCard = (row) => html`
   <tr class=${row.isSelected ? 'select' : '' } id=${row._id}>
      <td>${row.firstName} ${row.lastName}</td>
      <td>${row.email}</td>
      <td>${row.course}</td>
   </tr>
`;

document.querySelector('#searchBtn').addEventListener('click', onClick);
const tbodyElement = document.querySelector('tbody');

loadTableRows();

let initialDate = null;

function loadTableRows() {
   fetch(url)
      .then((res) => res.json())
      .then((res) => createTableRows(res))
      .catch((err) => console.error(err));
}

function createTableRows(data) {
   initialDate = Object.values(data)
      .map((r) => ({ ...r, isSelected: false }));

   const result = initialDate.map((r) => rowCard(r));
   render(result, tbodyElement);
}

function onClick() {
   const searchFieldInputElement = document.getElementById('searchField');
   const searchFieldText = searchFieldInputElement.value;
   searchFieldInputElement.value = '';

   if (!searchFieldText) {
      return alert('The field is required!');
   }

   searchMatches(searchFieldText);
}

function searchMatches(searchFieldText) {
   searchFieldText = searchFieldText.toLowerCase();

   initialDate.forEach((curr) => {
      if (curr.firstName.toLowerCase().includes(searchFieldText) ||
         curr.lastName.toLowerCase().includes(searchFieldText) ||
         curr.email.toLowerCase().includes(searchFieldText) ||
         curr.course.toLowerCase().includes(searchFieldText)) {
         curr.isSelected = true;
      } else {
         curr.isSelected = false;
      }
   });

   const result = initialDate.map((r) => rowCard(r));
   render(result, tbodyElement);
}
