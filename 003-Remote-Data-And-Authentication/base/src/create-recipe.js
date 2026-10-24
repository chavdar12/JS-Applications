document.getElementById('create-recipe').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

    try {
        const res = await fetch('http://localhost:3030/data/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessionStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                name: data.name,
                img: data.img,
                ingredients: lines(data.ingredients),
                steps: lines(data.steps)
            })
        });
        if (!res.ok) {
            throw new Error((await res.json()).message);
        }
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message);
    }
});
