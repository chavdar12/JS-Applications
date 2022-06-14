function solve() {
    let currentStop = 'depot';
    let nexStop = '';

    let departButtonElement = document.getElementById('depart');
    let arriveButtonElement = document.getElementById('arrive');
    let infoSpanElement = document.querySelector('div#info span.info');

    function depart() {
        const baseUrl = 'http://localhost:3030/jsonstore/bus/schedule/';

        fetch(baseUrl + currentStop)
            .then((res) => res.json())
            .then((data) => showInfo(data))
            .catch((err) => showError(err));
    }

    function arrive() {
        infoSpanElement.textContent = `Arriving at ${currentStop}`;
        currentStop = nexStop;

        changeButtons();
    }

    function showInfo(data) {
        const { name, next } = data;

        currentStop = name;
        nexStop = next;
        infoSpanElement.textContent = `Next stop ${currentStop}`;

        changeButtons();
    }

    function changeButtons() {
        departButtonElement.disabled = !departButtonElement.disabled;
        arriveButtonElement.disabled = !arriveButtonElement.disabled;
    }

    function showError() {
        infoSpanElement.textContent = 'Error';
        departButtonElement.disabled = true;
        arriveButtonElement.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();