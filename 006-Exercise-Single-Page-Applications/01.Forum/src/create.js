import {displayComments} from './comments.js';

let topicInputElement = document.getElementById('topicName');
let usernameInputElement = document.getElementById('username');
let postInputElement = document.getElementById('postText');

let url = 'http://localhost:3030/jsonstore/collections/myboard/posts';

let mainElement = document.querySelector('main');
let topicContainerElement = document.querySelector('.topic-container');

let postBtn = document.querySelector('.post');
postBtn.addEventListener('click', postTopic);

export function postTopic(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let topicName = formData.get('topicName');
    let username = formData.get('username');
    let postText = formData.get('postText');
    let time = new Date().toLocaleString();

    if (topicName == '' || username == '' || postText == '') {
        return alert('Please fill the required fields!');
    }

    fetch('http://localhost:3030/jsonstore/collections/myboard/posts', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({topicName, username, postText, time})
    })
        .then(response => response.json())
        .then(data => {
            displayTopics();
        })
        .catch(error => alert(error.message));
}


let cancelBtn = document.querySelector('.cancel');


function displayTopics() {
    topicContainerElement.replaceChildren();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            Object.values(data).forEach(e => {
                let wrapperDivElement = createElement('div', undefined, 'wrapper', topicContainerElement);
                let topicDivElement = createElement('div', undefined, 'topicName', wrapperDivElement);
                let anchorElement = createElement('a', undefined, undefined, topicDivElement);
                let h2Element = createElement('h2', e.topicName, undefined, anchorElement);
                h2Element.setAttribute('_id', e._id);
                h2Element.style.textDecoration = 'underline';

                let columnDivElement = createElement('div', undefined, 'columns', topicDivElement);
                let datePElement = createElement('p', 'Date: ', undefined, columnDivElement);
                let timeElement = createElement('time', e.time, undefined, datePElement);

                let userDivElement = createElement('div', undefined, 'username', columnDivElement);
                let userPElement = createElement('p', 'Username: ', undefined, userDivElement);
                let spanElement = createElement('span', e.username, undefined, userPElement);

                topicDivElement.addEventListener('click', viewTopic);
            });
        })
        .catch(error => alert(error.message));
}

function viewTopic(event) {
    if (event.target.tagName == 'H2') {
        let targetId = event.target.getAttribute('data-id');
        mainElement.replaceChildren();
        homepage.style.display = 'none';

        fetch(`${url}/${targetId}`)
            .then(response => response.json())
            .then(data => {
                let h2Element = createElement('h2', data.topicName, undefined, mainElement);
                let commentDivElement = createElement('div', undefined, 'comment', main);
                let headerDivElement = createElement('div', undefined, 'header', commentDivElement);
                let imgElement = createElement('img', undefined, undefined, headerDivElement);
                let pElement = createElement('p', undefined, undefined, headerDivElement);
                let spanElement = createElement('span', `${data.username} posted on: `, undefined, pElement);
                let contentPElement = createElement('p', data.postText, 'postContent', headerDivElement);
            })
            .catch(error => alert(error.message));
    }
    viewCommentBox();
    displayComments();
}

export function createElement(type, textCon, className, parent) {
    const element = document.createElement(type);

    if (textCon) {
        element.textContent = textCon;
    }
    if (className) {
        element.className = className;
    }
    if (parent) {
        parent.appendChild(element);
    }

    return element;
}
