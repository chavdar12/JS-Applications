function loadCommits() {
    const baseUrl = 'https://api.github.com/repos/';

    let usernameInputElement = document.getElementById('username');
    let repoInputElement = document.getElementById('repo');
    let commitsUlElement = document.getElementById('commits');

    fetch(baseUrl + `${usernameInputElement.value}/${repoInputElement.value}/commits`)
        .then((res) => res.json())
        .then((data) => showCommints(data))
        .catch((err) => showError(err));

    usernameInputElement.value = '';
    repoInputElement.value = '';

    function showCommints(data) {
        clearUlElement();

        data.forEach((curr) => {
            let liElement = document.createElement('li');
            liElement.textContent = `${curr.commit.author.name}: ${curr.commit.message}`;

            commitsUlElement.appendChild(liElement);
        });
    }

    function showError() {
        clearUlElement();

        let liElement = document.createElement('li');
        liElement.textContent = 'Error: 404 (Not Found)';

        commitsUlElement.appendChild(liElement);
    }

    function clearUlElement() {
        commitsUlElement.innerHTML = '';
    }
}