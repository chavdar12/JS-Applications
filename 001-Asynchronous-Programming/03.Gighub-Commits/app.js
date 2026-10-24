async function loadCommits() {
    const username = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;
    const list = document.getElementById('commits');

    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} (Not Found)`);
        }
        const commits = await res.json();

        list.replaceChildren(...commits.map(({ commit }) => {
            const li = document.createElement('li');
            li.textContent = `${commit.author.name}: ${commit.message}`;
            return li;
        }));
    } catch (err) {
        const li = document.createElement('li');
        li.textContent = err.message;
        list.replaceChildren(li);
    }
}
