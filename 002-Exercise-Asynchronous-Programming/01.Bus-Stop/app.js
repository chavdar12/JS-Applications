async function getInfo() {
    const stopId = document.getElementById('stopId').value;
    const stopName = document.getElementById('stopName');
    const buses = document.getElementById('buses');

    buses.replaceChildren();
    try {
        const res = await fetch(`http://localhost:3030/jsonstore/bus/businfo/${stopId}`);
        if (!res.ok) {
            throw new Error();
        }
        const data = await res.json();

        stopName.textContent = data.name;
        buses.replaceChildren(...Object.entries(data.buses).map(([bus, time]) => {
            const li = document.createElement('li');
            li.textContent = `Bus ${bus} arrives in ${time} minutes`;
            return li;
        }));
    } catch {
        stopName.textContent = 'Error';
    }
}
