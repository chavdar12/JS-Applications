import {createElement} from "./create.js";

let main = document.querySelector('main');

export function displayComments() {
    let commentDivElement = document.querySelector('.comment');

    fetch('http://localhost:3030/jsonstore/collections/myboard/comments')
        .then(response => response.json())
        .then(data => {
            Object.values(data).forEach(e => {
                let usersDivElement = createElement('div', undefined, 'userComment', commentDivElement);
                let headerDivElement = createElement('div', undefined, 'header', usersDivElement);
                let imgElement = createElement('img', undefined, undefined, headerDivElement);
                imgElement.setAttribute('src', './static/profile.png');
                let pElement = createElement('p', undefined, undefined, headerDivElement);
                let spanElement = createElement('strong', `${e.username} commented on: `, undefined, pElement);
                let TimeElement = createElement('time', e.time, undefined, pElement);
                let contentPElement = createElement('p', e.postText, 'postContent', headerDivElement);
            });
        })
        .catch(error => alert(error.message));
}
