function solve() {
    const baseUrl = 'http://localhost:3030/jsonstore/cookbook/';

    fetch(baseUrl + 'recipes')
        .then((res) => res.json())
        .then((data) => showRecipes(data))
        .catch((err) => console.error(err));

    function showRecipes(data) {
        let mainParentElement = document.querySelector('main');
        mainParentElement.innerHTML = '';

        Object.keys(data).forEach((recipeId) => {
            const { _id, name, img } = data[recipeId];

            let articleParentElement = createHtmlElement('article', ['preview'], '', [{ key: 'id', value: `${_id}` }], { name: 'click', function: getRecipe });
            let divTitleParentElement = createHtmlElement('div', ['title']);
            let h2Element = createHtmlElement('h2', null, `${name}`);
            let divSmallParentElement = createHtmlElement('div', ['small']);
            let imgElement = createHtmlElement('img', null, '', [{ key: 'src', value: `${img}` }]);

            appendChildren([imgElement], divSmallParentElement);
            appendChildren([h2Element], divTitleParentElement);
            appendChildren([divTitleParentElement, divSmallParentElement], articleParentElement);
            appendChildren([articleParentElement], mainParentElement);
        });
    }

    function getRecipe(e) {
        const targetId = e.currentTarget.id;

        fetch(baseUrl + `details/${targetId}`)
            .then((res) => res.json())
            .then((data) => showRecipe(data))
            .catch((err) => console.error(err));
    }

    function showRecipe(data) {
        const { _id, name, img, steps, ingredients } = data;
        let mainParentElement = document.querySelector('main');
        mainParentElement.innerHTML = '';

        let articleParentElement = createHtmlElement('article');
        let h2Element = createHtmlElement('h2', null, `${name}`);
        let divBandParentElement = createHtmlElement('div', ['band']);
        let divThumbParentElement = createHtmlElement('div', ['thumb']);
        let imgElement = createHtmlElement('img', null, '', [{ key: 'src', value: `${img}` }]);

        appendChildren([imgElement], divThumbParentElement);

        let divIngredintsParentElement = createHtmlElement('div', ['ingredients']);
        let h3IngredientsElement = createHtmlElement('h3', null, 'Ingredients:');
        let ulParentElement = createHtmlElement('ul');

        ingredients.forEach((ingredient) => {
            let liElement = createHtmlElement('li', null, `${ingredient}`);
            appendChildren([liElement], ulParentElement);
        });

        appendChildren([h3IngredientsElement, ulParentElement], divIngredintsParentElement);
        appendChildren([divThumbParentElement, divIngredintsParentElement], divBandParentElement);

        let divDescriptionParentElement = createHtmlElement('div', ['description']);
        let h3PreparationElement = createHtmlElement('h3', null, 'Preparation:');

        appendChildren([h3PreparationElement], divDescriptionParentElement);

        steps.forEach((step) => {
            let pElement = createHtmlElement('p', null, `${step}`);
            appendChildren([pElement], divDescriptionParentElement);
        });

        appendChildren([h2Element, divBandParentElement, divDescriptionParentElement], articleParentElement);
        appendChildren([articleParentElement], mainParentElement);
    }

    function createHtmlElement(
        tagName,
        classNames,
        textContent,
        attributes,
        event
    ) {
        let element = document.createElement(tagName);

        if (classNames) {
            element.classList.add(...classNames);
        }

        if (textContent) {
            element.textContent = textContent;
        }

        if (attributes) {
            attributes.forEach((a) => element.setAttribute(a.key, a.value));
        }

        if (event) {
            element.addEventListener(event.name, event.function);
        }

        return element;
    }

    function appendChildren(children, parent) {
        children.forEach((c) => parent.appendChild(c));
        return parent;
    }
}

solve();