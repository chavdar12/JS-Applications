async function solution() {
    const BASE_URL = 'http://localhost:3030/jsonstore/advanced/articles';
    const main = document.getElementById('main');

    const res = await fetch(`${BASE_URL}/list`);
    const articles = await res.json();

    main.replaceChildren(...articles.map(createArticle));

    function createArticle({ _id, title }) {
        const div = document.createElement('div');
        div.className = 'accordion';
        div.innerHTML = `
            <div class="head">
                <span></span>
                <button class="button">More</button>
            </div>
            <div class="extra">
                <p></p>
            </div>`;
        div.querySelector('span').textContent = title;
        const button = div.querySelector('button');
        button.id = _id;
        button.addEventListener('click', toggle);
        return div;
    }

    async function toggle(e) {
        const button = e.target;
        const extra = button.closest('.accordion').querySelector('.extra');

        if (button.textContent === 'Less') {
            extra.style.display = 'none';
            button.textContent = 'More';
            return;
        }
        const detailsRes = await fetch(`${BASE_URL}/details/${button.id}`);
        const { content } = await detailsRes.json();
        extra.querySelector('p').textContent = content;
        extra.style.display = 'block';
        button.textContent = 'Less';
    }
}

solution();
