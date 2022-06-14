import { renderHome } from './pages/homePage.js';
import { setUserData,  hideAllSections, showNav } from './utils.js';

export function checkUser(data) {
    if (data.code === 403) {
        return alert(data.message);
    } else {
        setUserData(data);
        showNav();
        hideAllSections();
        renderHome();
    }
}