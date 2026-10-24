function solve() {
    const [input, output] = document.querySelectorAll('textarea');
    const [generateBtn, buyBtn] = document.querySelectorAll('#exercise > button');
    const tbody = document.querySelector('tbody');

    generateBtn.addEventListener('click', () => {
        for (const item of JSON.parse(input.value)) {
            tbody.appendChild(createRow(item));
        }
    });

    buyBtn.addEventListener('click', () => {
        const bought = [...tbody.querySelectorAll('tr')]
            .filter((tr) => tr.querySelector('input[type="checkbox"]').checked)
            .map((tr) => {
                const [name, price, factor] = [...tr.querySelectorAll('p')].map((p) => p.textContent);
                return { name, price: Number(price), factor: Number(factor) };
            });
        const total = bought.reduce((sum, f) => sum + f.price, 0);
        const avgFactor = bought.length ? bought.reduce((sum, f) => sum + f.factor, 0) / bought.length : 0;

        output.value = [
            `Bought furniture: ${bought.map((f) => f.name).join(', ')}`,
            `Total price: ${total.toFixed(2)}`,
            `Average decoration factor: ${avgFactor}`
        ].join('\n');
    });

    function createRow({ img, name, price, decFactor }) {
        const tr = document.createElement('tr');
        const imgTd = document.createElement('td');
        const image = document.createElement('img');
        image.src = img;
        imgTd.appendChild(image);
        tr.appendChild(imgTd);
        for (const text of [name, price, decFactor]) {
            const td = document.createElement('td');
            const p = document.createElement('p');
            p.textContent = text;
            td.appendChild(p);
            tr.appendChild(td);
        }
        const checkTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkTd.appendChild(checkbox);
        tr.appendChild(checkTd);
        return tr;
    }
}
