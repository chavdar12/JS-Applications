function getInfo() {
    const baseUrl = 'http://localhost:3030/jsonstore/bus/businfo/';
    const validBusIds = ['1287', '1308', '1327', '2334'];

    let stopNameDivElement = document.getElementById('stopName');
    let busesUlElement = document.getElementById('buses');
    let stopIdInputElement = document.getElementById('stopId');

    if (!validBusIds.includes(stopIdInputElement.value)) {
        showError();
    } else {
        fetch(baseUrl + stopIdInputElement.value)
            .then((res) => res.json())
            .then((data) => showBusInfo(data))
            .catch((err) => showError(err));
    }

    stopIdInputElement.value = '';

    function showBusInfo(data) {
        const { name, buses } = data;

        stopNameDivElement.textContent = `${name}`;
        busesUlElement.innerHTML = '';

        Object.keys(buses).forEach((bus) => {
            const time = buses[bus];

            let liElement = document.createElement('li');
            liElement.textContent = `Bus ${bus} arrives in ${time} minutes`;

            busesUlElement.appendChild(liElement);
        });
    }

    function showError() {
        busesUlElement.innerHTML = ''
        stopNameDivElement.textContent = 'Error';
    }
}