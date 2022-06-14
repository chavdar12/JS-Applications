export function createHtmlElement(
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

export function appendChildren(children, parent) {
    children.forEach((c) => parent.appendChild(c));
    return parent;
}