function attachEvents() {
    const baseUrl = 'http://localhost:3030/jsonstore/forecaster/';
    const symbols = {
        'sunny': '☀',
        'partly sunny': '⛅',
        'overcast': '☁',
        'rain': '☂',
        'degrees': '°',
    };

    let forecastDivElement = document.getElementById('forecast');
    let currentDivElement = document.getElementById('current');
    let upcomingDivElement = document.getElementById('upcoming');

    let submitButtonElement = document.getElementById('submit');
    submitButtonElement.addEventListener('click', getWeatherInfo);

    function getWeatherInfo() {
        fetch(baseUrl + 'locations')
            .then((res) => res.json())
            .then((data) => findTargetLocation(data))
            .catch((err) => showError(err));
    }

    function findTargetLocation(data) {
        forecastDivElement.style.display = 'block';

        let locationInputElement = document.getElementById('location');
        const targetLocation = data.find((x) => x.name.toLowerCase() === locationInputElement.value.toLowerCase());

        locationInputElement.value = '';

        if (!targetLocation) {
            showError();
            return;
        }

        const targetCode = targetLocation.code;

        Promise.all([
            fetch(baseUrl + `today/${targetCode}`).then((res) => res.json()),
            fetch(baseUrl + `upcoming/${targetCode}`).then((res) => res.json()),
        ])
            .then((data) => {
                const todayWeatherInfo = data[0];
                const upcomingWeatherInfo = data[1];

                showWeatherToday(todayWeatherInfo);
                showWeatherUpcoming(upcomingWeatherInfo);

            })
            .catch((err) => showError(err));
    }

    function showError() {
        let divErrorElement = createHtmlElement('div', null, 'Error');
        divErrorElement.style.color = 'red';
        divErrorElement.style.fontSize = '22px';
        divErrorElement.style.textAlign = 'center';

        appendChildren([divErrorElement], forecastDivElement);

        currentDivElement.style.display = 'none';
        upcomingDivElement.style.display = 'none';

        setTimeout(() => {
            divErrorElement.remove();
        }, 2000);
    }

    function showWeatherToday(info) {
        const { forecast: { condition, high, low }, name } = info;

        currentDivElement.style.display = 'block';
        currentDivElement.innerHTML = '';

        let divLabelElement = createHtmlElement('div', ['label'], 'Current conditions');
        let divForecastsParentElement = createHtmlElement('div', ['forecasts']);
        let spanConditionSymbolElement = createHtmlElement('span', ['condition', 'symbol'], symbols[condition.toLowerCase()]);
        let spanConditionParentElement = createHtmlElement('span', ['condition']);
        let spanNameElement = createHtmlElement('span', ['forecast-data'], `${name}`);
        let spanDegreesElement = createHtmlElement('span', ['forecast-data'], `${low}${symbols.degrees}/${high}${symbols.degrees}`);
        let spanConditionElement = createHtmlElement('span', ['forecast-data'], `${condition}`);

        appendChildren([spanNameElement, spanDegreesElement, spanConditionElement], spanConditionParentElement);
        appendChildren([spanConditionSymbolElement, spanConditionParentElement], divForecastsParentElement);
        appendChildren([divLabelElement, divForecastsParentElement], currentDivElement);
    }

    function showWeatherUpcoming(info) {
        const forecast = info.forecast;

        upcomingDivElement.style.display = 'block';
        upcomingDivElement.innerHTML = '';

        let divLabelElement = createHtmlElement('div', ['label'], 'Three-day forecast');
        let divForecastInfoParentElement = createHtmlElement('div', ['forecast-info']);

        forecast.forEach((curr) => {
            const { condition, high, low } = curr;

            let spanUpcomingParentElement = createHtmlElement('span', ['upcoming']);
            let spanSymbolElement = createHtmlElement('span', ['symbol'], `${symbols[condition.toLowerCase()]}`);
            let spanDegreesElement = createHtmlElement('span', ['forecast-data'], `${low}${symbols.degrees}/${high}${symbols.degrees}`);
            let spanConditionElement = createHtmlElement('span', ['forecast-data'], `${condition}`);

            appendChildren([spanSymbolElement, spanDegreesElement, spanConditionElement], spanUpcomingParentElement);
            appendChildren([spanUpcomingParentElement], divForecastInfoParentElement);
        });

        appendChildren([divLabelElement, divForecastInfoParentElement], upcomingDivElement);
    }

    function createHtmlElement(
        tagName,
        classNames,
        textContent,
        attributes,
        event
    ) {
        let element = document.createElement(tagName);

        if (classNames) {
            element.classList.add(...classNames);
        }

        if (textContent) {
            element.textContent = textContent;
        }

        if (attributes) {
            attributes.forEach((a) => element.setAttribute(a.key, a.value));
        }

        if (event) {
            element.addEventListener(event.name, event.function);
        }

        return element;
    }

    function appendChildren(children, parent) {
        children.forEach((c) => parent.appendChild(c));
        return parent;
    }
}

attachEvents();