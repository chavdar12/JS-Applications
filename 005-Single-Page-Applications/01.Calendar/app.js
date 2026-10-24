function solve() {
    const sections = [...document.querySelectorAll('body > section')];
    const show = (id) => sections.forEach((s) => (s.style.display = s.id === id ? '' : 'none'));

    show('years');

    document.body.addEventListener('click', (e) => {
        const section = e.target.closest('section');
        if (!section) {
            return;
        }

        if (e.target.closest('caption')) {
            if (section.classList.contains('monthCalendar')) {
                show('years');
            } else if (section.classList.contains('daysCalendar')) {
                const [, year] = section.id.split('-');
                show(`year-${year}`);
            }
            return;
        }

        const cell = e.target.closest('td.day');
        if (!cell) {
            return;
        }
        if (section.id === 'years') {
            show(`year-${cell.textContent.trim()}`);
        } else if (section.classList.contains('monthCalendar')) {
            const month = [...section.querySelectorAll('td.day')].indexOf(cell) + 1;
            show(`month-${section.id.split('-')[1]}-${month}`);
        }
    });
}

solve();
