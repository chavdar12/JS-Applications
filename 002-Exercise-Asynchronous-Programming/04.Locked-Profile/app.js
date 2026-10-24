async function lockedProfile() {
    const main = document.getElementById('main');

    const res = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
    const profiles = Object.values(await res.json());

    main.replaceChildren(...profiles.map((p, i) => createProfile(p, i + 1)));

    function createProfile({ username, email, age }, n) {
        const div = document.createElement('div');
        div.className = 'profile';
        div.innerHTML = `
            <img src="./iconProfile2.png" class="userIcon" />
            <label>Lock</label>
            <input type="radio" name="user${n}Locked" value="lock" checked>
            <label>Unlock</label>
            <input type="radio" name="user${n}Locked" value="unlock"><br>
            <hr>
            <label>Username</label>
            <input type="text" name="user${n}Username" disabled readonly />
            <div class="hiddenInfo">
                <hr>
                <label>Email:</label>
                <input type="email" name="user${n}Email" disabled readonly />
                <label>Age:</label>
                <input type="text" name="user${n}Age" disabled readonly />
            </div>
            <button>Show more</button>`;
        // values are set as properties so user data is never parsed as HTML
        div.querySelector(`[name="user${n}Username"]`).value = username;
        div.querySelector(`[name="user${n}Email"]`).value = email;
        div.querySelector(`[name="user${n}Age"]`).value = age;
        div.querySelector('button').addEventListener('click', toggle);
        return div;
    }

    function toggle(e) {
        const profile = e.target.parentElement;
        if (profile.querySelector('input[value="lock"]').checked) {
            return;
        }
        const show = e.target.textContent === 'Show more';
        profile.querySelectorAll('.hiddenInfo > input, .hiddenInfo > label')
            .forEach((el) => (el.style.display = show ? 'block' : ''));
        e.target.textContent = show ? 'Hide it' : 'Show more';
    }
}
