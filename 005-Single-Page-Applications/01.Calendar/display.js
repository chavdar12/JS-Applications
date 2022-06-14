function loadView(view) {
    document.body.innerHTML = '';
    document.body.appendChild(view);
}

function displayYears(view) {
    loadView(view);
}

function displayYear(years, year) {
    loadView(years[`year-${year}`]);
}

function displayMonth(months, monthIndex, year) {
    let monthElement = months.view(x => x.id == `month=${year}-${monthIndex + 1}`);
    loadView(monthElement);
}

export {loadView, displayYears, displayYear, displayMonth}
