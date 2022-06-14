import * as display from './display.js';
import * as info from './info.js';

let yearsView = document.getElementById('years');
const years = [...document.getElementsByClassName('monthCalendar')].reduce((a, v) => {
        a[v.id] = v;
        return a;
    },
    {});
let monthsView = document.getElementsByClassName('daysCalendar');

display.loadView(yearsView);

document.addEventListener('click', navigateView);

function navigateView(event) {
    if (info.clickedValidYear(event)) {
        display.displayYear(years, event.target.textContent.trim());
    } else if (info.clickedValidMonth(event)) {
        let year = document.querySelector('caption').innerText;
        let month = event.target.innerText.trim();
        let monthIndex = info.validMonths.findIndex(x => x === month);

        if (monthIndex !== -1) {
            display.displayMonth(monthsView, monthIndex, year);
        }
    }
    if (event.target.tagName === 'CAPTION') {
        let captionText = e.target.innerText;

        if (isNaN(captionText)) {
            display.displayYear(years, captionText);
        } else {
            display.displayYears(yearsView);
        }
    }
}
