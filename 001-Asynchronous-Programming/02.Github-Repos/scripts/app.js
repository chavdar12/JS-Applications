function loadRepos() {
	const baseUrl = 'https://api.github.com/users/';

	let usernameInputElement = document.getElementById('username');
	let reposUlElement = document.getElementById('repos');

	fetch(baseUrl + `${usernameInputElement.value}/repos`)
		.then((res) => res.json())
		.then((data) => showRepos(data))
		.catch((err) => showError(err));

	usernameInputElement.value = '';

	function showRepos(data) {
		reposUlElement.innerHTML = '';

		data.forEach((curr) => {
			let liElement = document.createElement('li');

			let aElement = document.createElement('a');
			aElement.textContent = `${curr.full_name}`;
			aElement.href = `${curr.html_url}`;

			liElement.appendChild(aElement);
			reposUlElement.appendChild(liElement);
		});
	}

	function showError() {
		reposUlElement.innerHTML = '';
		let liElement = document.createElement('li');
		liElement.textContent = 'Not Found';

		reposUlElement.appendChild(liElement);
	}
}