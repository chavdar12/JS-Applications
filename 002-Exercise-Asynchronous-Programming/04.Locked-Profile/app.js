function lockedProfile() {
    const baseUrl = 'http://localhost:3030/jsonstore/advanced/profiles';
    let mainElement = document.getElementById('main');

    fetch(baseUrl)
        .then((res) => res.json())
        .then((data) => showUsers(data))
        .catch((err) => console.error(err));

    function showUsers(data) {
        let profileDivElement = document.querySelector('main#main div.profile');
        mainElement.innerHTML = '';

        Object.keys(data).forEach((userId, index) => {
            const { _id, username, email, age } = data[userId];

            let clonedUserProfileElement = profileDivElement.cloneNode(true);
            const currentUserCount = index + 1

            clonedUserProfileElement.children[2].name = `user${currentUserCount}Locked`;
            clonedUserProfileElement.children[4].name = `user${currentUserCount}Locked`;
            clonedUserProfileElement.children[8].name = `user${currentUserCount}Username`;
            clonedUserProfileElement.children[8].value = `${username}`;
            clonedUserProfileElement.children[9].id = `user${currentUserCount}HiddenFields`;
            clonedUserProfileElement.children[9].children[2].name = `user${currentUserCount}Email`;
            clonedUserProfileElement.children[9].children[2].value = `${email}`;
            clonedUserProfileElement.children[9].children[4].name = `user${currentUserCount}Age`;
            clonedUserProfileElement.children[9].children[4].value = `${age}`;
            clonedUserProfileElement.children[10].addEventListener('click', toggleUserInfo);

            mainElement.appendChild(clonedUserProfileElement);
        });
    }

    function toggleUserInfo(e) {
        let targetButton = e.target;
        let targetElement = targetButton.parentElement;

        const isLocked = targetElement.children[2].checked;

        if (isLocked) {
            return;
        }

        targetButton.textContent === 'Show more'
            ? targetButton.textContent = 'Hide it'
            : targetButton.textContent = 'Show more';

        toggleHiddenInfo(targetElement.children[9]);
    }

    function toggleHiddenInfo(element) {
        Array.from(element.children).forEach((child) => {
            child.style.display === 'block'
                ? child.style.display = 'none'
                : child.style.display = 'block'
        });
    }
}