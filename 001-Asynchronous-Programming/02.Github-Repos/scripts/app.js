async function loadRepos() {
    const username = document.getElementById('username').value;
    const list = document.getElementById('repos');

    try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos`);
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`.trim());
        }
        const repos = await res.json();

        list.replaceChildren(...repos.map((repo) => {
            const a = document.createElement('a');
            a.href = repo.html_url;
            a.textContent = repo.full_name;
            const li = document.createElement('li');
            li.appendChild(a);
            return li;
        }));
    } catch (err) {
        const li = document.createElement('li');
        li.textContent = err.message;
        list.replaceChildren(li);
    }
}
