let validMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function clickedValidMonth(event) {
    event.path.some(x => x.className == 'monthCalendar' && x.tagName == 'SECTION');
}

function clickedValidYear(event) {
    event.path.some(x => x.id == 'years' && x.tagName == 'SECTION') &&
    (event.target.className == 'date' || event.target.className == 'day');
}

export {validMonths, clickedValidMonth, clickedValidYear}
