export function el(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    element.append(...children);
    return element;
}
