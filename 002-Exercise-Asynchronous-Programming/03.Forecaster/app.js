function attachEvents() {
    const BASE_URL = 'http://localhost:3030/jsonstore/forecaster';
    const symbols = {
        'Sunny': '☀',
        'Partly sunny': '⛅',
        'Overcast': '☁',
        'Rain': '☔',
        'Degrees': '°'
    };

    const input = document.getElementById('location');
    const forecast = document.getElementById('forecast');
    const current = document.getElementById('current');
    const upcoming = document.getElementById('upcoming');

    document.getElementById('submit').addEventListener('click', getWeather);

    async function getJson(url) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }

    function span(className, text) {
        const el = document.createElement('span');
        el.className = className;
        el.textContent = text;
        return el;
    }

    function temps({ low, high }) {
        return `${low}${symbols.Degrees}/${high}${symbols.Degrees}`;
    }

    async function getWeather() {
        current.querySelector('.forecasts')?.remove();
        upcoming.querySelector('.forecast-info')?.remove();
        forecast.querySelector('.error')?.remove();
        forecast.style.display = 'block';

        try {
            const locations = await getJson(`${BASE_URL}/locations`);
            const location = locations.find((l) => l.name === input.value);
            if (!location) {
                throw new Error('Location not found');
            }
            const [today, threeDay] = await Promise.all([
                getJson(`${BASE_URL}/today/${location.code}`),
                getJson(`${BASE_URL}/upcoming/${location.code}`)
            ]);

            const conditions = span('condition', '');
            conditions.append(
                span('forecast-data', today.name),
                span('forecast-data', temps(today.forecast)),
                span('forecast-data', today.forecast.condition));
            const todayDiv = document.createElement('div');
            todayDiv.className = 'forecasts';
            todayDiv.append(span('condition symbol', symbols[today.forecast.condition]), conditions);
            current.appendChild(todayDiv);

            const upcomingDiv = document.createElement('div');
            upcomingDiv.className = 'forecast-info';
            upcomingDiv.append(...threeDay.forecast.map((day) => {
                const el = span('upcoming', '');
                el.append(
                    span('symbol', symbols[day.condition]),
                    span('forecast-data', temps(day)),
                    span('forecast-data', day.condition));
                return el;
            }));
            upcoming.appendChild(upcomingDiv);
        } catch {
            const error = document.createElement('div');
            error.className = 'label error';
            error.textContent = 'Error';
            forecast.prepend(error);
        }
    }
}

attachEvents();
