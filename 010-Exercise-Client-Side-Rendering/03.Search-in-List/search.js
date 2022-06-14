import { html, render } from './node_modules/lit-html/lit-html.js';
import { towns } from './towns.js';

const townCard = (town) => html`
   <li class=${town.isMatch ? 'active' : '' }>${town.name}</li>
`;

const townsCard = (towns) => html`
   <ul>${towns.map(townCard)}</ul>
`;

const searchButtonElement = document.querySelector('article button');
searchButtonElement.addEventListener('click', searchTown);

const townsAsObj = convertTownsAsObj();
renderTowns();

function renderTowns() {
   const result = townsCard(townsAsObj);
   const townsDivElement = document.getElementById('towns');

   render(result, townsDivElement);
}

function convertTownsAsObj() {
   return towns.map((town) => ({ name: town, isMatch: false }));
}

function searchTown() {
   const searchTextInputElement = document.getElementById('searchText');
   const searchText = searchTextInputElement.value;
   searchTextInputElement.value = '';

   if (!searchText) {
      return alert('The field is required!');
   }

   townsAsObj.forEach((town) => {
      town.isMatch = town.name.toLowerCase().includes(searchText.toLowerCase());
   });

   showMatchesCount();
   renderTowns();
}

function showMatchesCount() {
   const resultDivElement = document.getElementById('result');
   const counter = townsAsObj.filter((town) => town.isMatch).length;

   resultDivElement.textContent = `${counter} matches found`;
}
