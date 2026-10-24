function solve() {
    const info = document.querySelector('#info span');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    let stop = { next: 'depot' };

    async function depart() {
        departBtn.disabled = true;
        try {
            const res = await fetch(`http://localhost:3030/jsonstore/bus/schedule/${stop.next}`);
            if (!res.ok) {
                throw new Error();
            }
            stop = await res.json();
            info.textContent = `Next stop ${stop.name}`;
            arriveBtn.disabled = false;
        } catch {
            info.textContent = 'Error';
            departBtn.disabled = true;
            arriveBtn.disabled = true;
        }
    }

    function arrive() {
        info.textContent = `Arriving at ${stop.name}`;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return { depart, arrive };
}

const result = solve();
