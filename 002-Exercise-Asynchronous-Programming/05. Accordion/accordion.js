function solution() {
    const baseUrl = 'http://localhost:3030/jsonstore/advanced/articles/';

    fetch(baseUrl + 'list')
        .then((res) => res.json())
        .then((data) => showArticles(data))
        .catch((err) => console.error(err));

    function showArticles(data) {
        let mainSectionElement = document.getElementById('main');

        data.forEach((curr) => {
            const { _id, title } = curr;

            let divAccordionParentElement = createHtmlElement('div', ['accordion']);
            let divHeadParentElement = createHtmlElement('div', ['head']);
            let spanElement = createHtmlElement('span', null, `${title}`);
            let buttonElement = createHtmlElement('button', ['button'], 'More', [{ key: 'id', value: `${_id}` }], { name: 'click', function: toggleMoreInfo });

            appendChildren([spanElement, buttonElement], divHeadParentElement);
            appendChildren([divHeadParentElement], divAccordionParentElement);
            appendChildren([divAccordionParentElement], mainSectionElement);
        });
    }

    function toggleMoreInfo(e) {
        const targetButton = e.target;
        const targetArticle = targetButton.parentElement.parentElement;

        if (targetButton.textContent === 'Less') {
            targetButton.textContent = 'More';
            targetArticle.children[1].remove();
            return;
        }

        targetButton.textContent = 'Less';
        const targetId = targetButton.id;

        fetch(baseUrl + `details/${targetId}`)
            .then((res) => res.json())
            .then((data) => showHiddenInfo(data, targetArticle))
            .catch((err) => console.error(err));
    }

    function showHiddenInfo(data, parentElement) {
        let divExtraParentElement = createHtmlElement('div', ['extra']);
        let pElement = createHtmlElement('p', null, `${data.content}`);

        appendChildren([pElement], divExtraParentElement);
        appendChildren([divExtraParentElement], parentElement);

        divExtraParentElement.style.display = 'block';
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

solution();