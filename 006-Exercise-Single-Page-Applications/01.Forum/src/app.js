import { setupHome } from './home.js';
import { setupDetails } from './details.js';

const main = document.querySelector('main');
const homeNodes = [main.querySelector('.new-topic-border'), main.querySelector('.topic-title')];
const detailsSection = document.getElementById('current-post');
detailsSection.remove();

const views = {
    home: { nodes: homeNodes, show: setupHome(homeNodes, navigate) },
    details: { nodes: [detailsSection], show: setupDetails(detailsSection) }
};

document.getElementById('home').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('home');
});

navigate('home');

function navigate(name, ...params) {
    const view = views[name];
    main.replaceChildren(...view.nodes);
    return view.show(...params);
}
